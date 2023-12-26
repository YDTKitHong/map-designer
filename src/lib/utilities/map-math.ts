import {
	PathType,
	type ArcPathType,
	type CoordinatePoint,
	type Path
} from '$lib/models/map-models';

interface Vector2D {
	i: number;
	j: number;
}

export function calulateTangentArc(
	previousPath: Path,
	radius: number,
	angle: number,
	counterClockwise: boolean
): ArcPathType | undefined {
	if (previousPath.pathType == PathType.Straight) {
		// Assume the starting point of the arc is the end point of the previous straight path
		const startingPoint = previousPath.endingCoordinate;
		const previousPathUnitVector: Vector2D = calculateLineUnitVector(
			previousPath.endingCoordinate,
			previousPath.startingCoordinate
		);

		const newPathVector = rotateVector(previousPathUnitVector, Math.PI / 2);

		// Calculate the center of the arc based on the direction of the previous straight line
		const center = {
			x: previousPath.endingCoordinate.x + newPathVector.i * radius * (counterClockwise ? 1 : -1),
			y: previousPath.endingCoordinate.y + newPathVector.j * radius * (counterClockwise ? 1 : -1)
		};

		// Assuming you have a function to calculate the ending point of the arc based on angle
		const endingPoint = calculateArcEndingPoint(
			center,
			radius,
			angle,
			startingPoint,
			counterClockwise
		);

		return {
			pathType: PathType.Arc,
			startingCoordinate: startingPoint,
			endingCoordinate: endingPoint,
			centerOfRotation: center,
			counterClockwise: counterClockwise
		};
	} else if (previousPath.pathType == PathType.Arc) {
		const startingPoint = previousPath.endingCoordinate; // Starting point of the new arc
		const previousArc = previousPath as ArcPathType;

		const lastAngle = Math.atan2(
			previousArc.endingCoordinate.y - previousArc.centerOfRotation.y,
			previousArc.endingCoordinate.x - previousArc.centerOfRotation.x
		);

		// Calculate the direction of the tangent arc
		const direction = counterClockwise ? -1 : 1;
		const newAngle = lastAngle + (Math.PI / 180) * angle * direction;

		// Calculate the center of the new arc
		const center: CoordinatePoint = {
			x: previousArc.endingCoordinate.x + radius * Math.cos(newAngle),
			y: previousArc.endingCoordinate.y + radius * Math.sin(newAngle)
		};

		// Calculate the ending point of the new arc
		const endingPoint = calculateArcEndingPoint(
			center,
			radius,
			newAngle,
			startingPoint,
			counterClockwise
		);

		return {
			pathType: PathType.Arc,
			startingCoordinate: startingPoint,
			endingCoordinate: endingPoint,
			centerOfRotation: center,
			counterClockwise: counterClockwise
			// Other properties specific to ArcPathType
		};
	} else {
		return undefined;
	}
}

function calculateArcEndingPoint(
	center: CoordinatePoint,
	radius: number,
	angle: number,
	startingPoint: CoordinatePoint,
	counterClockwise: boolean
): CoordinatePoint {
	const startingAngle = Math.atan2(startingPoint.y - center.y, startingPoint.x - center.x);
	const endingX = center.x + radius * Math.cos(startingAngle + (counterClockwise ? -1 : 1) * angle);
	const endingY = center.y + radius * Math.sin(startingAngle + (counterClockwise ? -1 : 1) * angle);
	return { x: endingX, y: endingY };
}

export function calculateArcStartingAngle(arcPath: ArcPathType) {
	return Math.atan2(
		arcPath.startingCoordinate.y - arcPath.centerOfRotation.y,
		arcPath.startingCoordinate.x - arcPath.centerOfRotation.x
	);
}

export function calculateArcEndingAngle(arcPath: ArcPathType) {
	return Math.atan2(
		arcPath.endingCoordinate.y - arcPath.centerOfRotation.y,
		arcPath.endingCoordinate.x - arcPath.centerOfRotation.x
	);
}

export function calculateArcRadiuc(arcPath: ArcPathType) {
	return Math.sqrt(
		Math.pow(arcPath.startingCoordinate.x - arcPath.centerOfRotation.x, 2) +
			Math.pow(arcPath.startingCoordinate.y - arcPath.centerOfRotation.y, 2)
	);
}

function rotateVector(vector: Vector2D, angleInRadians: number): Vector2D {
	const cosAngle = Math.cos(angleInRadians);
	const sinAngle = Math.sin(angleInRadians);

	const i = vector.i * cosAngle - vector.j * sinAngle;
	const j = vector.i * sinAngle + vector.j * cosAngle;

	return { i, j };
}

function calculateLineUnitVector(point1: CoordinatePoint, point2: CoordinatePoint): Vector2D {
	const previousPathLength = calculateDistance(point1, point2);
	return {
		i: (point2.x - point1.x) / previousPathLength,
		j: (point2.y - point1.y) / previousPathLength
	};
}

function calculateDistance(point1: CoordinatePoint, point2: CoordinatePoint): number {
	const deltaX = point2.x - point1.x;
	const deltaY = point2.y - point1.y;

	const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
	return distance;
}
