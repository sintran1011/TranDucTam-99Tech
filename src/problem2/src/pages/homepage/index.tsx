import React, { ReactNode, useEffect, useRef } from "react";
import { renderTokenSvg, transformFromTo, transformToForm } from "@/utils";
import useGetWorkpace from "@/hooks/useGetPrice";
import { Box, Button, debounce, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import BasicForm from "@/components/Form";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import BasicSelect from "@/components/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { swapSchema } from "@/schema/swap.schema";
import InputNumber from "@/components/input-number";
import SwapModal from "./ModalSwap";
import { ASSETS_USER } from "@/global/mock";

const { FormItem } = BasicForm;

interface FormValues {
  fromToken?: string;
  fromAmount?: string;
  toToken?: string;
  toAmount?: string;
  assetUser?: string;
}

const DEFAULT_VALUES = {
  fromToken: "USD",
  fromAmount: "",
  toToken: "USDC",
  toAmount: "",
};

// The file build too large because of svg token not in list, i dont have time to select and clear, sorry about that

const HomePage = () => {
  const { data: { priceList, tokenList } = {} } = useGetWorkpace();
  const [isChanged, setIsChanged] = React.useState(false);
  const timeoutRef = useRef<any>(null);
  const form = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(swapSchema),
  });

  const { watch, reset, setValue } = form;
  const fromToken = watch("fromToken") || "";
  const toToken = watch("toToken") || "";
  const fromAmount = watch("fromAmount");
  const toAmount = watch("toAmount");
  const assetUser = ASSETS_USER[fromToken as keyof typeof ASSETS_USER];

  const assetToken: string =
    fromToken && assetUser ? `${assetUser.toFixed(6)}` : "0";

  const [open, setOpen] = React.useState(false);

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

  const handleSubmit = (val: FormValues) => {
    console.log(val, "value");
    setOpen(true);
  };

  const handleError = (error: unknown) => {
    console.log(error, "error");
  };

  const handleSwapPosition = () => {
    setValue("fromToken", toToken);
    setValue("toToken", fromToken);
    setValue("fromAmount", toAmount);
    setValue("toAmount", fromAmount);
  };

  const handleTransformFromTo = () => {
    if (priceList) {
      const toAmount = transformFromTo({
        fromAmount: fromAmount ? Number(fromAmount) : 0,
        fromPrice: priceList[fromToken],
        toPrice: priceList[toToken],
      });
      setValue("toAmount", `${toAmount}`, { shouldValidate: true });
    }
  };

  const handleTransformToFrom = () => {
    if (priceList) {
      const fromAmount = transformToForm({
        toAmount: toAmount ? Number(toAmount) : 0,
        fromPrice: priceList[fromToken],
        toPrice: priceList[toToken],
      });
      setValue("fromAmount", `${fromAmount}`, { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (fromAmount && !isChanged) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleTransformFromTo();
      }, 500);
    }
  }, [fromAmount]);

  useEffect(() => {
    if (toAmount && !isChanged) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleTransformToFrom();
      }, 500);
    }
  }, [toAmount]);

  useEffect(() => {
    if (fromToken) {
      setValue("assetUser", `${assetUser}`);
    }
  }, [fromToken]);

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      minWidth={"450px"}
      minHeight={"100dvh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <BasicForm
        onSubmit={handleSubmit}
        onError={handleError}
        className="mx-auto w-full max-w-[450px] relative"
        form={form}
        formName="SwapForm"
      >
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
                fontWeight={400}
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
                {assetToken} USDC{" "}
              </Typography>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <FormItem showError name="fromToken">
                <BasicSelect
                  renderValue={(i) => renderTokenWithIcon(i as string, true)}
                  height={"40px"}
                  options={generateOptions() || []}
                />
              </FormItem>
              <FormItem showError name="fromAmount">
                <InputNumber
                  onFocus={() => {
                    setValue("toAmount", "");
                    setIsChanged(false);
                  }}
                  size="small"
                  placeholder="200000 - 0"
                />
              </FormItem>
            </Stack>
            <Typography
              component={"div"}
              onClick={() => setValue("fromAmount", assetToken)}
              color="#eab308"
              fontSize={"14px"}
              textAlign={"right"}
              sx={{ cursor: "pointer" }}
            >
              Max
            </Typography>
          </Box>
          <Box
            height={113}
            width={"100%"}
            bgcolor={"#f5f5f4"}
            borderRadius={2}
            padding={2}
          >
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
                To
              </Typography>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <FormItem showError name="toToken">
                <BasicSelect
                  renderValue={(i) => renderTokenWithIcon(i as string, true)}
                  height={"40px"}
                  options={generateOptions() || []}
                />
              </FormItem>
              <FormItem showError name="toAmount">
                <InputNumber
                  size="small"
                  placeholder="200000 - 0"
                  onFocus={() => {
                    setValue("fromAmount", "");
                    setIsChanged(false);
                  }}
                />
              </FormItem>
            </Stack>
          </Box>
          <div
            onClick={handleSwapPosition}
            className="flex justify-center items-center bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer"
          >
            <SwapVertIcon />
          </div>
        </Stack>
      </BasicForm>
      <Button
        sx={{ marginTop: "16px", width: "100%" }}
        variant="contained"
        form="SwapForm"
        type="submit"
      >
        Confirm swap
      </Button>
      <SwapModal
        open={open}
        handleClose={() => setOpen(false)}
        fromToken={watch("fromToken")}
        toToken={watch("toToken")}
        refresh={() => reset(DEFAULT_VALUES)}
      />
    </Stack>
  );
};

export default HomePage;
