import React, { ReactNode } from "react";
import { renderTokenSvg } from "@/utils";
import useGetWorkpace from "@/hooks/useGetPrice";
import { Box, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import BasicForm from "@/components/Form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import BasicSelect from "@/components/select";
const { FormItem } = BasicForm;

const DEFAULT_VALUES = {
  fromToken: "USDT",
};

const HomePage = () => {
  const { data: { data: priceList, tokenList } = {} } = useGetWorkpace();
  const form = useForm({ defaultValues: DEFAULT_VALUES });
  console.log(priceList, "data");
  console.log(tokenList, "tokenList");

  const renderTokenWithIcon = (i: string, isValue?: boolean) => (
    <Typography
      fontSize="14px"
      color={isValue ? "black" : "#fff"}
      lineHeight="20px"
      display={"flex"}
      alignItems={"center"}
      gap={1}
    >
      {renderTokenSvg(i)}
      {i}
    </Typography>
  );

  const generateOptions = () => {
    return tokenList?.map((i) => ({
      label: renderTokenWithIcon(i),
      value: i,
    }));
  };

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      minWidth={"450px"}
      minHeight={"100dvh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <BasicForm className="mx-auto w-full max-w-[450px] relative" form={form}>
        <Stack width={"100%"} gap={2}>
          <Box width={"100%"} bgcolor={"#f5f5f4"} borderRadius={2} padding={2}>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                fontWeight={600}
                fontSize={"14px"}
                lineHeight={"20px"}
                color={"#9ca3af"}
              >
                From
              </Typography>
              <Typography
                fontWeight={600}
                fontSize={"14px"}
                lineHeight={"20px"}
                color={"#9ca3af"}
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                gap={1}
              >
                <span className="border-dashed border-black border-b leading-4">
                  Usable
                </span>{" "}
                0 USDC{" "}
                <Typography component={"span"} color="#fcd34d">
                  <AddCircleOutlineIcon />
                </Typography>
              </Typography>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <FormItem name="fromToken">
                <BasicSelect
                  renderValue={(i) => renderTokenWithIcon(i as string, true)}
                  height={"40px"}
                  options={generateOptions() || []}
                />
              </FormItem>
            </Stack>
          </Box>
          <Box
            width={"100%"}
            height={"200px"}
            bgcolor={"#f5f5f4"}
            borderRadius={1}
          />
          <div className="flex justify-center items-center bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer">
            <SwapVertIcon />
          </div>
        </Stack>
      </BasicForm>
    </Stack>
  );
};

export default HomePage;
