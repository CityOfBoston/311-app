// flow-typed signature: 07423e13d22d83c255c563e719e383f4
// flow-typed version: 53afdde167/react-router-native_v4.x.x/flow_>=v0.38.x

declare module 'react-router-native' {
  declare export type GetUserConfirmation =
    (message: string, callback: (confirmed: boolean) => void) => void

  declare type LocationShape = {
    pathname?: string,
    search?: string,
    hash?: string,
    state?: any,
  }

  declare export type Match = {
    params: Object,
    isExact: boolean,
    path: string,
    url: string,
  }

  declare export class NativeRouter extends React$Component {
    props: {
      getUserConfirmation?: GetUserConfirmation,
      keyLength?: number,
      children?: React$Element<*>,
    }
  }

  declare export class Link extends React$Component {
    props: {
      to: string | LocationShape,
      replace?: boolean,
      children?: React$Element<*>,
    }
  }

  declare export class DeepLinking extends React$Component {}

  declare export class AndroidBackButton extends React$Component {}

  declare export class Redirect extends React$Component {
    props: {
      to: string | LocationShape,
      push?: boolean,
    }
  }

  declare export class Route extends React$Component {
    props: {
      component?: ReactClass<*>,
      render?: (router: ContextRouter) => React$Element<*>,
      children?: (router: ContextRouter) => React$Element<*>,
      path?: string,
      exact?: bool,
      strict?: bool,
    }
  }

  declare export class Switch extends React$Component {
    props: {
      children?: Array<React$Element<*>>,
    }
  }

  declare export type Location = {
    pathname: string,
    search: string,
    hash: string,
    state?: any,
    key?: string,
  }

  declare export type HistoryAction = 'PUSH' | 'REPLACE' | 'POP'

  declare export type RouterHistory = {
    length: number,
    location: Location,
    action: HistoryAction,
    listen(callback: (location: Location, action: HistoryAction) => void): () => void,
    push(path: string | LocationShape, state?: any): void,
    replace(path: string | LocationShape, state?: any): void,
    go(n: number): void,
    goBack(): void,
    goForward(): void,
    canGo?: (n: number) => bool,
    block(callback: (location: Location, action: HistoryAction) => boolean): void,
    // createMemoryHistory
    index?: number,
    entries?: Array<Location>,
  }

  declare export type ContextRouter = {
    history: RouterHistory,
    location: Location,
    match: Match,
  }

  declare type FunctionComponent<P> = (props: P) => ?React$Element<any>;
  declare type ClassComponent<D, P, S> = Class<React$Component<D, P, S>>;
  declare export function withRouter<P, S>(Component: ClassComponent<void, P, S> | FunctionComponent<P>): ClassComponent<void, $Diff<P, ContextRouter>, S>;

  declare type MatchPathOptions = {
    path: string,
    exact?: boolean,
    strict?: boolean,
  }

  declare export function matchPath(pathname: string, options: MatchPathOptions): null | Match
}
