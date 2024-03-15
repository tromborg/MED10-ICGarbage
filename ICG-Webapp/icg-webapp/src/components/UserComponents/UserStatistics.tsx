import { FunctionComponent, useEffect, useState } from "react";
import { Container, Flex, Heading, Button } from "@chakra-ui/react";
import { ApiService } from "../../services/ApiService";
import { Chart } from "react-google-charts";
import { IUserRegistry } from "../../apicalls";

const UserStatistics: FunctionComponent = () => {
  const [userData, setUserData] = useState<IUserRegistry[]>();
  const colors = [
    "#d8f3dc",
    "#b7e4c7",
    "#95d5b2",
    "#74c69d",
    "#52b788",
    "#40916c",
    "#2d6a4f",
    "#1b4332",
    "#081c15",
  ];

  const handleGetScoreboard = async () => {
    const scoreboardData = await ApiService.client().get_scoreboard();
    if (scoreboardData) {
      const sortedData = scoreboardData.slice().sort((a, b) => {
        const pointsA = a.points || 0;
        const pointsB = b.points || 0;
        return pointsB - pointsA;
      });
      setUserData(sortedData);
    }
  };

  const options = {
    title: "Top 10 users by points",
    hAxis: { title: "Username" },
    vAxis: { title: "Points", minValue: 0 },
  };

  useEffect(() => {
    handleGetScoreboard();
  }, []);

  return (
    <Container>
      <Heading>Statistikker</Heading>
      {userData && (
        <Flex>
          <Chart
            chartType="ColumnChart"
            width="600px"
            height="400px"
            data={[
              ["user", "Points", { role: "style" }],
              ...userData.map((user, index) => [
                user.userName,
                user.points,
                colors[index],
              ]),
            ]}
            options={options}
          />
        </Flex>
      )}
    </Container>
  );
};

export default UserStatistics;
