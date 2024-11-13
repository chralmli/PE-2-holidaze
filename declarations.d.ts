declare module 'react-leaflet-markercluster' {
  import { Component } from 'react';
  import { LayerOptions } from 'leaflet';
  import { LayerGroupProps } from 'react-leaflet';

  interface MarkerClusterGroupProps extends LayerOptions, LayerGroupProps {
    children?: React.ReactNode;
    onClusterClick?: (cluster: any) => void;
    onClusterMouseover?: (cluster: any) => void;
    onClusterMouseout?: (cluster: any) => void;
  }

  export default class MarkerClusterGroup extends Component<MarkerClusterGroupProps> {}
}