import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  height?: number;
}

const PieChart = ({ data, height = 350 }: PieChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    // 过滤掉值为 0 的数据项
    const validData = data.filter(item => item.value > 0);
    const total = validData.reduce((sum, item) => sum + item.value, 0);

    // 如果没有数据，显示空状态
    if (total === 0 || validData.length === 0) {
      const option: EChartsOption = {
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#999',
            fontSize: 14,
          },
        },
      };
      chartInstance.current.setOption(option);
      return;
    }

    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const percent = ((params.value / total) * 100).toFixed(1);
          return `${params.marker}${params.name}<br/>数量: ${params.value} 条<br/>占比: ${percent}%`;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: {
          fontSize: 12,
        },
        formatter: (name: string) => {
          const item = validData.find((d) => d.name === name);
          const percent = item && item.value > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
          return `${name}  ${percent}%`;
        },
      },
      series: [
        {
          name: '工单状态',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            fontSize: 12,
            formatter: (params: any) => {
              const percent = ((params.value / total) * 100).toFixed(0);
              return `${params.value}条\n${percent}%`;
            },
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            smooth: true,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
          data: validData,
          color: [
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#bfbfbf' },
              { offset: 1, color: '#8c8c8c' },
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#4facfe' },
              { offset: 1, color: '#1890ff' },
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#95de64' },
              { offset: 1, color: '#52c41a' },
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ff7875' },
              { offset: 1, color: '#f5222d' },
            ]),
          ],
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

export default PieChart;
