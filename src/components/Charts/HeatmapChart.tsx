import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface HeatmapChartProps {
  data: [number, number, number][]; // [day, hour, value]
  height?: number;
}

const HeatmapChart = ({ data, height = 350 }: HeatmapChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  const hours = ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'];
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current, null as any);

    // 计算最大值用于颜色映射
    const maxValue = Math.max(...data.map((item) => item[2]), 1);

    const option: EChartsOption = {
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
        formatter: (params: any) => {
          const value = params.data[2];
          if (value === 0) return `${days[params.data[1]]} ${hours[params.data[0]]}<br/>暂无加班`;
          return `<strong>${days[params.data[1]]} ${hours[params.data[0]]}</strong><br/>加班次数: <strong>${value}</strong> 次`;
        },
      },
      grid: {
        left: '12%',
        right: '5%',
        bottom: '20%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: hours,
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250, 250, 250, 0.1)', 'rgba(250, 250, 250, 0.3)'],
          },
        },
        axisLabel: {
          fontSize: 11,
          color: '#666',
          interval: 0,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: days,
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250, 250, 250, 0.1)', 'rgba(250, 250, 250, 0.3)'],
          },
        },
        axisLabel: {
          fontSize: 11,
          color: '#666',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: false,        // 👈 改为 false 就不能拖拉了
        orient: 'horizontal',
        left: 'center',
        bottom: '2%',
        textStyle: {
          fontSize: 11,
        },
        itemWidth: 15,
        itemHeight: 120,
        inRange: {
          color: [
            '#e0f7fa',
            '#80deea',
            '#4dd0e1',
            '#26c6da',
            '#00bcd4',
            '#00acc1',
            '#0097a7',
            '#00838f',
            '#006064',
          ],
        },
      },
      series: [
        {
          name: '加班频率',
          type: 'heatmap',
          data: data,
          label: {
            show: true,
            fontSize: 11,
            color: '#333',
            fontWeight: 'bold',
            formatter: (params: any) => {
              return params.data[2] > 0 ? params.data[2] : '';
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: '#fff',
              borderWidth: 2,
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
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

export default HeatmapChart;
