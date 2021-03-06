// flow-typed signature: f7bb46cfdab48e66ade749e20b68a469
// flow-typed version: <<STUB>>/react-native-camera_v0.9.4/flow_v0.42.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   'react-native-camera'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module 'react-native-camera' {

  declare type Props = {
    style?: any,
    aspect?: string | number,
    orientation?: string | number,
  };

  declare export type CaptureOptions = {||};
  declare export type CapturedPhoto = {|
    data?: string,
    path: string,
    mediaUri: string,
    width?: number,
    height?: number,
    duration?: number,
    'size'?: number,
  |};

  declare export default class Camera extends React$Component {
    props: Props;

    static constants: {
      Aspect: { [key: string]: string },
    };

    capture(opts?: CaptureOptions): Promise<CapturedPhoto>;
  }
}
