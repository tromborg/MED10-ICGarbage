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
  Divider,
} from "@chakra-ui/react";
import { ApiService } from "../../services/ApiService";
import { Chart } from "react-google-charts";
import { IUserRegistry } from "../../apicalls";
import { UserService } from "../../models/UserService";
import { userSessionDb } from "../SessionDB";
import { ITimeSeriesInstance } from "../../apicalls";
import themes from '../../design/themes';
import { ChevronDownIcon } from "@chakra-ui/icons";

const UserStatistics: FunctionComponent = () => {
  const [userData, setUserData] = useState<IUserRegistry[]>();
  const [timeData, setTimeData] = useState<ITimeSeriesInstance[]>();
  const [filteredTimeData, setFilteredTimeData] =
    useState<ITimeSeriesInstance[]>();
  const [filteredTimeDataLine, setFilteredTimeDataLine] =
    useState<ITimeSeriesInstance[]>();
  const [timePeriod, setTimePeriod] = useState<string>("Last Month");
  const [timePeriodLine, setTimePeriodLine] = useState<string>("Last Month");
  const timePeriods = ["Last Week", "Last Month", "Last Year", "All Time"];

  const getTimeSeriesData = async () => {
    let userService = new UserService();
    let user = await userSessionDb.getUserFromSessionDb();
    console.log("user: ");
    let timeSeriesData = await userService.GetTimeSeriesData(user.userId!);
    if (timeSeriesData !== null) {
      setTimeData(timeSeriesData);
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
      case "All Time":
        dateRange = new Date(currentDate);
        dateRange.setFullYear(dateRange.getFullYear() - 10);
        break;
    }

    const filteredData = timeData?.filter((item) => {
      const itemDate = item.timeStamp ? new Date(item.timeStamp) : null;
      return (
        itemDate &&
        dateRange &&
        itemDate >= dateRange &&
        itemDate <= currentDate
      );
    });

    const sortedData = filteredData?.sort((a, b) => {
      const dateA = new Date(a.timeStamp || 0);
      const dateB = new Date(b.timeStamp || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return sortedData;
  }

  const options = {
    hAxis: { title: "Date" },
    vAxis: { title: "Points", minValue: 0 },
    animation: {
      startup: true,
      easing: "linear",
      duration: 200,
    },
  };

  function formatDate(timestamp: Date) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    handleGetScoreboard();
    getTimeSeriesData();
  }, []);

  useEffect(() => {
    setFilteredTimeData(filterDataByTime(timePeriod));
  }, [timePeriod, timeData]);

  useEffect(() => {
    setFilteredTimeDataLine(filterDataByTime(timePeriodLine));
  }, [timePeriodLine, timeData]);

  return (
    <Flex width="100%" flexDirection="column">
      <Box m="10px" alignSelf="center">
        <Heading alignSelf="center" color={themes.adobePalette.darker}>STATISTIKKER</Heading>
      </Box>
      {filteredTimeData && filteredTimeDataLine && (
        <Flex width="100%">
          <Box
            backgroundColor="white"
            width="50%"
            height="550px"
            pl="2%"
            pr="2%"
            pb="2%"
            margin="10px"
            borderRadius={10}
            borderWidth="1px"
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="center"
              alignItems="center"
              height="60px"
            >
              <Text fontSize={24}>{timePeriod}s waste points progress</Text>
            </Box>
            <Divider />
            <Box
              display="flex"
              mt="10px"
              width="100%"
              justifyContent="flex-end"
            >
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<ChevronDownIcon />}
                >
                  Time Period
                </MenuButton>
                <MenuList>
                  {timePeriods.map((period) => (
                    <MenuItem onClick={() => setTimePeriod(period)}>
                      {period}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
            <Box>
              <Chart
                chartType="ColumnChart"
                width="600px"
                height="400px"
                data={[
                  ["Timestamp", "Points", { role: "style" }],
                  ...filteredTimeData.map((user, index) => [
                    user.timeStamp ? formatDate(user.timeStamp) : "",
                    user.points,
                    "#40916c",
                  ]),
                ]}
                options={options}
              />
            </Box>
          </Box>
          <Box
            backgroundColor="white"
            width="50%"
            height="550px"
            pl="2%"
            pr="2%"
            pb="2%"
            margin="10px"
            borderRadius={10}
            borderWidth="1px"
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="center"
              alignItems="center"
              height="60px"
            >
              <Text fontSize={24}>Waste points balance through time</Text>
            </Box>
            <Divider />
            <Box
              display="flex"
              mt="10px"
              width="100%"
              justifyContent="flex-end"
            >
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<ChevronDownIcon />}
                >
                  Time Period
                </MenuButton>
                <MenuList>
                  {timePeriods.map((period) => (
                    <MenuItem onClick={() => setTimePeriodLine(period)}>
                      {period}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Chart
                chartType="Line"
                width="600px"
                height="400px"
                data={[
                  ["Timestamp", "Points", { role: "style" }],
                  ...filteredTimeDataLine
                    .slice()
                    .reverse()
                    .map((user, index) => [
                      user.timeStamp ? formatDate(user.timeStamp) : "",
                      user.currentPoints,
                      "#40916c",
                    ]),
                ]}
                options={options}
              />
            </Box>
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default UserStatistics;
