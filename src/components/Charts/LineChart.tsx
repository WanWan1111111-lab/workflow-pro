import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface LineChartProps {
  data: {
    dates: string[];
    normalHours: number[];
    overtimeHours: number[];
  };
  height?: number;
}

const LineChart = ({ data, height = 350 }: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current, undefined);

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue}</strong><br/>`;
          params.forEach((item: any) => {
            result += `${item.marker}${item.seriesName}: ${item.value}h<br/>`;
          });
          const total = params.reduce((sum: number, item: any) => sum + item.value, 0);
          result += `<strong>总计: ${total.toFixed(1)}h</strong>`;
          return result;
        },
      },
      legend: {
        data: ['正常工时', '加班工时'],
        top: 10,
        textStyle: {
          fontSize: 12,
        },
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dates,
        axisLabel: {
          fontSize: 11,
          rotate: 0,
        },
        axisLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '工时 (h)',
        nameTextStyle: {
          fontSize: 12,
        },
        axisLabel: {
          fontSize: 11,
          formatter: '{value}h',
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#e0e0e0',
          },
        },
        axisLine: {
          show: false,
        },
      },
      series: [
        {
          name: '正常工时',
          type: 'line',
          smooth: true,
          data: data.normalHours,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#1890ff',
          },
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#4facfe' },
            ]),
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.4)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ]),
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderColor: '#1890ff',
              borderWidth: 2,
            },
          },
        },
        {
          name: '加班工时',
          type: 'line',
          smooth: true,
          data: data.overtimeHours,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#faad14',
          },
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#faad14' },
              { offset: 1, color: '#ffd666' },
            ]),
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(250, 173, 20, 0.4)' },
              { offset: 1, color: 'rgba(250, 173, 20, 0.05)' },
            ]),
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderColor: '#faad14',
              borderWidth: 2,
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default LineChart;
