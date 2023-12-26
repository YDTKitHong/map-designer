<script lang="ts">
	import {
		PathType,
		type MapData,
		type Node,
		type Path,
		CommandType
	} from '$lib/models/map-models';
	import {
		calculateArcEndingAngle,
		calculateArcRadiuc,
		calculateArcStartingAngle,
		calulateTangentArc
	} from '$lib/utilities/map-math';
	import { onMount } from 'svelte';

	let mapCanvas: HTMLCanvasElement;
	let nodes: Node[] = [
		{
			id: '1',
			commands: [
				{ commandType: CommandType.ChangeSpeed, commandValue: 123 },
				{ commandType: CommandType.SetMode, commandValue: 'asd' }
			],
			coordinate: { x: 50, y: 50 },
			nodeAreaVertexPoints: [],
			pointTypes: []
		},
		{
			id: '2',
			commands: [],
			coordinate: { x: 100, y: 100 },
			nodeAreaVertexPoints: [
				{ x: 50, y: 50 },
				{ x: 50, y: 150 },
				{ x: 150, y: 150 },
				{ x: 50, y: 150 }
			],
			pointTypes: []
		},
		{
			id: '3',
			commands: [],
			coordinate: { x: 100, y: 100 },
			nodeAreaVertexPoints: [
				{ x: 50, y: 50 },
				{ x: 50, y: 150 },
				{ x: 150, y: 150 },
				{ x: 150, y: 50 }
			],
			pointTypes: []
		}
	];
	let nodes1to2path: Path[] = [
		// {
		// 	pathType: PathType.Arc,
		// 	startingCoordinate: { x: 40, y: 100 },
		// 	endingCoordinate: { x: 200, y: 200 },
		// 	centerOfRotation: { x: 150, y: 150 },
		// 	counterClockwise: false
		// },
		{
			pathType: PathType.Straight,
			startingCoordinate: { x: 250, y: 250 },
			endingCoordinate: { x: 150, y: 180 }
		}
	];

	let newMap: MapData = {
		nodeConnections: [
			{
				id: '1',
				fromNode: nodes[0],
				toNode: nodes[1],
				paths: nodes1to2path,
				isTwoWay: false
			}
		]
	};

	function drawMap(mapData: MapData, canvas: HTMLCanvasElement): void {
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			console.error('Canvas context unavailable');
			return;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		mapData.nodeConnections.forEach((connection) => {
			connection.paths.forEach((path) => {
				ctx.beginPath();
				ctx.moveTo(path.startingCoordinate.x, path.startingCoordinate.y);

				if (path.pathType == PathType.Arc) {
					let startingAngle = calculateArcStartingAngle(path);
					let endingAngle = calculateArcEndingAngle(path);
					let radius = calculateArcRadiuc(path);
					ctx.arc(
						path.centerOfRotation.x,
						path.centerOfRotation.y,
						radius,
						startingAngle,
						endingAngle,
						path.counterClockwise
					);
				} else if (path.pathType == PathType.Straight) {
					ctx.lineTo(path.endingCoordinate.x, path.endingCoordinate.y);
				}

				ctx.stroke();
				let arc = calulateTangentArc(path, 50, 90, true);

				if (arc) {
					console.log(calculateArcStartingAngle(arc));
					ctx.beginPath();
					ctx.moveTo(arc.startingCoordinate.x, arc.startingCoordinate.y);
					ctx.arc(
						arc.centerOfRotation.x,
						arc.centerOfRotation.y,
						calculateArcRadiuc(arc),
						calculateArcStartingAngle(arc),
						calculateArcEndingAngle(arc),
						arc.counterClockwise
					);
					ctx.stroke();
				}
			});
		});

		nodes.forEach((node) => {
			// Draw circles at starting and ending coordinates
			ctx.beginPath();
			ctx.arc(node.coordinate.x, node.coordinate.y, 3, 0, Math.PI * 2);
			ctx.fillStyle = 'blue';
			ctx.fill();

			if (node.nodeAreaVertexPoints.length > 2) {
				for (let i = 0; i < node.nodeAreaVertexPoints.length; i++) {
					const vertex = node.nodeAreaVertexPoints[i];
					ctx.moveTo(node.nodeAreaVertexPoints[i].x, node.nodeAreaVertexPoints[i].y);
					if (i == node.nodeAreaVertexPoints.length - 1) {
						ctx.lineTo(node.nodeAreaVertexPoints[0].x, node.nodeAreaVertexPoints[0].y);
					} else {
						ctx.lineTo(node.nodeAreaVertexPoints[i + 1].x, node.nodeAreaVertexPoints[i + 1].y);
					}
					ctx.stroke();
				}
			}
		});
	}

	onMount(async () => {
		drawMap(newMap, mapCanvas);
	});
</script>

<div>
	<canvas width="1000" height="800" bind:this={mapCanvas}></canvas>
</div>
