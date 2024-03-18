import { FunctionComponent, useEffect, useState } from "react";
import {
  Container,
  Flex,
  Heading,
  Button,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { ApiService } from "../../services/ApiService";
import { Chart } from "react-google-charts";
import { IUserRegistry } from "../../apicalls";
import { UserService } from "../../models/UserService";
import { userSessionDb } from "../SessionDB";
import { ITimeSeriesInstance } from "../../apicalls";

const UserStatistics: FunctionComponent = () => {
  const [userData, setUserData] = useState<IUserRegistry[]>();
  const [timeData, setTimeData] = useState<ITimeSeriesInstance[]>();
  const [filteredTimeData, setFilteredTimeData] =
    useState<ITimeSeriesInstance[]>();
  const [timePeriod, setTimePeriod] = useState<string>("Last Month");
  const timePeriods = ["Last Week", "Last Month", "Last Year"];

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

  const getTimeSeriesData = async () => {
    let userService = new UserService();
    let user = await userSessionDb.getUserFromSessionDb();
    console.log("user: ");
    let timeSeriesData = await userService.GetTimeSeriesData(user.userId!);
    if (timeSeriesData !== null) {
      setTimeData(timeSeriesData);
      setFilteredTimeData(timeSeriesData);
    } else {
      console.log("Timeseries data is null");
    }
  };

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

  function filterDataByTime(timeRange: string) {
    const currentDate = new Date();
    let dateRange: Date | undefined;

    switch (timeRange) {
      case "Last Week":
        dateRange = new Date(currentDate);
        dateRange.setDate(dateRange.getDate() - 7);
        break;
      case "Last Month":
        dateRange = new Date(currentDate);
        dateRange.setMonth(dateRange.getMonth() - 1);
        if (dateRange.getMonth() === currentDate.getMonth()) {
          dateRange.setDate(0);
        }
        break;
      case "Last Year":
        dateRange = new Date(currentDate);
        dateRange.setFullYear(dateRange.getFullYear() - 1);
        break;
    }

    return timeData?.filter((item) => {
      const itemDate = item.timeStamp ? new Date(item.timeStamp) : null;
      return (
        itemDate &&
        dateRange &&
        itemDate >= dateRange &&
        itemDate <= currentDate
      );
    });
  }

  const options = {
    hAxis: { title: "Date" },
    vAxis: { title: "Points", minValue: 0 },
  };

  useEffect(() => {
    handleGetScoreboard();
    getTimeSeriesData();
  }, []);

  useEffect(() => {
    console.log("bruv");
    setFilteredTimeData(filterDataByTime(timePeriod));
  }, [timePeriod]);

  return (
    <Flex width="100%" flexDirection="column">
      <Heading>Statistikker</Heading>
      {filteredTimeData && (
        <Flex width="100%">
          <Box
            backgroundColor="white"
            width="50%"
            height="100%"
            padding="2%"
            margin="10px"
            borderRadius={5}
            alignSelf="flex-start"
          >
            <Box display="flex" width="100%" justifyContent="center">
              <Text fontSize={24}>Top 10 users by points</Text>
            </Box>
            <Menu>
              <MenuButton>Time Period</MenuButton>
              <MenuList>
                {timePeriods.map((period) => (
                  <MenuItem onClick={() => setTimePeriod(period)}>
                    {period}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Box>
              <Chart
                chartType="ColumnChart"
                width="600px"
                height="400px"
                data={[
                  ["Timestamp", "Points", { role: "style" }],
                  ...filteredTimeData.map((user, index) => [
                    user.timeStamp,
                    user.points,
                    colors[index],
                  ]),
                ]}
                options={options}
              />
            </Box>
          </Box>
          <Box
            backgroundColor="white"
            width="50%"
            margin="10px"
            borderRadius={5}
          ></Box>
        </Flex>
      )}
    </Flex>
  );
};

export default UserStatistics;
