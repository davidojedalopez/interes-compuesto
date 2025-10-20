export type ChartDatasetConfig = {
    label: string;
    data: number[];
    stroke: string;
    fillColor?: string;
    dashed?: boolean;
};

export type D3Series = {
    label: string;
    values: number[];
    stroke: string;
    fillColor?: string;
    dashed?: boolean;
};
