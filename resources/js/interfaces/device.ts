export interface Device {
    id: number;
    status_id: number;
}

export interface DeviceState {
    [key: string]: any;
    namespace: string;
    devices: Device[];
}

export interface DeviceListData {
    selectedDevice: Device | null;
}
