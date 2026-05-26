import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface BarChartProps {
  data: {
    projects: string[];
    normalHours: number[];
    overtimeHours: number[];
  };
  height?: number;
}

const BarChart = ({ data, height = 350 }: BarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    // @ts-ignore - echarts.init 类型定义问题
    chartInstance.current = echarts.init(chartRef.current);

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
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
        bottom: '15%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.projects,
        axisLabel: {
          interval: 0,
          rotate: 30,
          fontSize: 11,
          formatter: (value: string) => {
            // 如果项目名太长，截断并添加省略号
            return value.length > 6 ? value.substring(0, 6) + '...' : value;
          },
        },
        axisTick: {
          alignWithLabel: true,
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
      },
      series: [
        {
          name: '正常工时',
          type: 'bar',
          stack: 'total',
          data: data.normalHours,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#4facfe' },
              { offset: 1, color: '#1890ff' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#1890ff' },
                { offset: 1, color: '#096dd9' },
              ]),
            },
          },
          label: {
            show: false,
          },
        },
        {
          name: '加班工时',
          type: 'bar',
          stack: 'total',
          data: data.overtimeHours,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ffd666' },
              { offset: 1, color: '#faad14' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#faad14' },
                { offset: 1, color: '#d48806' },
              ]),
            },
          },
          label: {
            show: false,
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // 响应式
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

export default BarChart;
