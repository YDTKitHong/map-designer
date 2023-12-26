export interface MapData {
	nodeConnections: NodeConnection[];
}

export interface Node {
	id: string;
	coordinate: CoordinatePoint;
	nodeAreaVertexPoints: CoordinatePoint[];
	commands: Command[];
	pointTypes: PointType[];
}

export type Path = StraightPathType | ArcPathType;

export enum PathType {
	Straight = 'Straight',
	Arc = 'Arc'
}

export interface StraightPathType {
	pathType: PathType.Straight;
	startingCoordinate: CoordinatePoint;
	endingCoordinate: CoordinatePoint;
}

export interface ArcPathType {
	pathType: PathType.Arc;
	startingCoordinate: CoordinatePoint;
	endingCoordinate: CoordinatePoint;
	centerOfRotation: CoordinatePoint;
	counterClockwise: boolean;
}

export interface CoordinatePoint {
	x: number;
	y: number;
}

export interface NodeConnection {
	id: string;
	fromNode: Node;
	toNode: Node;
	paths: Path[];
	isTwoWay: boolean;
}

export interface ChangeSpeedCommand {
	commandType: CommandType.ChangeSpeed;
	commandValue: number; // Specific type for ChangeSpeed command
}

export interface SetModeCommand {
	commandType: CommandType.SetMode;
	commandValue: string; // Specific type for SetMode command
}

export type Command = ChangeSpeedCommand | SetModeCommand;

export enum CommandType {
	ChangeSpeed = 'ChangeSpeed',
	SetMode = 'SetMode'
}

export enum PointType {
	PrimaryTrafficPoint,
	SecondaryTrafficPoint,
	TiertaryTrafficPoint,
	TrafficCheckOut
}
