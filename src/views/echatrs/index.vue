<template>
  <div id="echarts"></div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { $echarts, ECOption } from "@/utils/echarts";

onMounted(() => {
  // 测试echarts的引入
  const ele = document.getElementById("echarts") as HTMLCanvasElement;
  const myChart = $echarts.init(ele);
  const option: ECOption = {
    title: {
      text: "ECharts 入门示例",
    },
    tooltip: {},
    legend: {
      data: ["销量"],
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  };
});
</script>