<!--
# GUI
- Colors need to provide instruction and feedback.
  - Use a color palette

I need to know more about THREE.JS to make the MVP.
1. How do I intersect meshes?
2. How do I match Lines and Ellipses to forms?

I think your standard cube needs to draw ellipses on each plane. These should be able to be turned invisible. Or maybe you need to describe the planes by listing the indices of the list that holds all of the points.

So I need to list the points needed for a cube.
I need to organize the individual faces into a dictionary. I will then use this dictionary to place ellipses within a specific face.

Your Form_Manager needs to have classes for each Primitive Form.
-> If a form is inside of another form, you need to have a setting that describes whether it's added to the form, or subtracting from it.

If a mesh is inside of another mesh:
	if intersection = 1:
		the new mesh will be subtracted from the surface of the other mesh.
	else:
		the new mesh will be added to the surface of the other mesh.

How will I accomplish this?
- Figure this out later. After the MVP.

Lets just create a cube that can connect to Vanishing Points.
- On this cube, draw whole or parts of an Ellipse on each face.
- Given a mesh's surface, you should be able to add or subtract a mesh.
- Each straight line in a cube needs to lead towards a Vanishing Point. This VP doesn't have to converge. They can be separate. This wouldn't make them a point, though. This would be a direction. Perhaps you can separate a Direction and a Point in the properties. This could allow you to switch between a Direction and a Point, which will enable the cube's shape to change to point in a direction or towards a Vanishing Point.

There need to be 3 Lines that the Vanishing Points can be on.
- X, Y, and Z

Given that you're crating a form from a series of points, how would you intersect the points? I suppose you would have to pay attention to the order of points on the surface of the mesh.

---

1. Create all BoxBufferGeometry's.
2. Translate the geometries to create the form you ultimately want.
3. Subtract each geometry from the main geometry.
4. Convert the main geometry into a mesh, give it a material, add it to the scene.

Instead of using a BoxBufferGeometry, I want to use a BufferGeometry made from points, who are able to be drawn towards Vanishing Points or in a Direction.

I need a way to create a BufferGeometry and translate and scale it.

I just need a way to create a BufferGeometry whose straight lines can be drawn in perspective.

How do I get a line to be drawn towards a vanishing point?

How do you form a cube with Vanishing Points?

I need a way to create vanishing points and then draw a cube of any size that can lead to those VPs.

Is there a way to create a cube that has parallel lines, and then make them converge to a Vanishing Point?
- Perhaps there's a function that can take into account how the lines are supposed to be parallel, and will figure out how to move them closer to each other based on the distance to the Vanishing Point.
- By having this function, you should be able to scale, rotate, and translate this mesh.

A cube should have 12 lines, and they should each be grouped into 3 sets of 4 lines. Each set can be assigned a Direction or a Vanishing Point. 
- If not given a Vanishing Point, it will assign a standard Direction.

Use the BoxBufferGeometry and find the sets of parallel lines.
- Create functions that will set those parallel lines towards a Vanishing Point.

When adding or subtracting forms, keep track of which points are in or out of the set of points for the main form. These should be added to the grading rubric.

---

You need to learn more about Javascript Promises and use them to get forms to be added in the scene.

---

I want to have a few basic functions for creating a Primitive Form.
- create_point
- create_ellipse
- create_line

I need functions that will take the parts of a Primitive Form and creates a 

I want to create a cube that can contain an ellipse on each face, and a way to connect these lines. 

Create the basic forms 

I want a function that can find the leftmost and rightmost points on two ellipses and record their index. The grading rubric will then judge any lines drawn there to be 

add_cylinder()
-->

<main class='container' style="background-color:{background_color};overflow: hidden;">
	<canvas class="drawing" id="drawing_canvas" width={$window_size.width} height={$window_size.height} style="z-index: 2"></canvas>
	<canvas class="threejs" id="drawing_exercise" width={$window_size.width} height={$window_size.height} style="z-index: 1"></canvas>
</main>

<script>
  "use strict";
  import { onMount } from "svelte";
  import * as THREE from "three";
  import {
    get_speed_between_points,
    get_distance_between_points,
    get_angle_between_points
  } from "./Point_Comparison.js";
  import {
    list_of_x,
    list_of_y,
    list_of_timestamps,
    list_of_angles,
    list_of_distances,
    list_of_speeds,
    list_of_forms,
    window_size,
    list_of_meshes
  } from "./Pointer_Store.js";
  import { Driver } from "./neo4j-driver.js";
  import { background_color } from "./Palette.js";
  import { list_of_cube_edges } from "./Primitive_Form_Vertices_and_Edges.js";

  onMount(async () => {
    class PointerEvents {
      constructor() {
        this.down = this.down.bind(this);
        this.move = this.move.bind(this);
        this.up = this.up.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.get_line_data = this.get_line_data.bind(this);

        this.drawing_canvas = document.getElementById("drawing_canvas");
        this.ctx = this.drawing_canvas.getContext("2d");
        this.ctx.canvas.style.touchAction = "none";
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = `#000000`;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";

        //Draw lines
        this.isDown = false;
        this.points = [];
        this.beginPoint = null;
        this.timeStart = 0.0;

        this.drawing_canvas.addEventListener("pointerdown", this.down, false);
        this.drawing_canvas.addEventListener("pointermove", this.move, false);
        this.drawing_canvas.addEventListener("pointerup", this.up, false);
        this.drawing_canvas.addEventListener("pointerout", this.up, false);
      }

      down(evt) {
        this.isDown = true;
        const x = evt.layerX - this.drawing_canvas.offsetLeft;
        const y = evt.layerY - this.drawing_canvas.offsetTop;
        this.points.push({ x, y });
        this.beginPoint = { x, y };
        this.timeStart = window.performance.now();
        $list_of_x = [x];
        $list_of_y = [y];
        $list_of_timestamps = [0];
        $list_of_speeds = [];
        $list_of_angles = [];
      }

      move(evt) {
        if (!this.isDown) return;

        const x = evt.layerX - this.drawing_canvas.offsetLeft;
        const y = evt.layerY - this.drawing_canvas.offsetTop;
        this.points.push({ x, y });

        this.get_line_data(x, y);

        if (this.points.length > 1) {
          const lastTwoPoints = this.points.slice(-2);
          const controlPoint = lastTwoPoints[0];
          const endPoint = {
            x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
            y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
          };
          this.drawLine(this.beginPoint, controlPoint, endPoint);
          this.beginPoint = endPoint;
        }
      }

      up(evt) {
        if (!this.isDown) return;
        const x = evt.layerX - this.drawing_canvas.offsetLeft;
        const y = evt.layerY - this.drawing_canvas.offsetTop;
        this.points.push({ x, y });

        if (this.points.length > 1) {
          this.get_line_data(x, y);

          const lastTwoPoints = this.points.slice(-2);
          const controlPoint = lastTwoPoints[0];
          const endPoint = lastTwoPoints[1];
          this.drawLine(this.beginPoint, controlPoint, endPoint);
        }

        this.beginPoint = null;
        this.isDown = false;
        this.points = [];
      }

      drawLine(beginPoint, controlPoint, endPoint) {
        this.ctx.beginPath();
        this.ctx.moveTo(beginPoint.x, beginPoint.y);
        this.ctx.quadraticCurveTo(
          controlPoint.x,
          controlPoint.y,
          endPoint.x,
          endPoint.y
        );
        this.ctx.stroke();
        this.ctx.closePath();
      }

      get_line_data(x, y) {
        if (x !== $list_of_x.at(-1) || y !== $list_of_y.at(-1)) {
          let current_time = window.performance.now() - this.timeStart;
          $list_of_x = [...$list_of_x, x];
          $list_of_y = [...$list_of_y, y];
          $list_of_timestamps = [...$list_of_timestamps, current_time];

          let point1 = {
            x: $list_of_x.at(-2),
            y: $list_of_y.at(-2),
            ms: $list_of_timestamps.at(-2)
          };
          let point2 = {
            x: $list_of_x.at(-1),
            y: $list_of_y.at(-1),
            ms: $list_of_timestamps.at(-1)
          };

          let speed = get_speed_between_points(point1, point2);
          let distance = get_distance_between_points(point1, point2);

          if (speed > 0) {
            let angle = get_angle_between_points(point1, point2);

            $list_of_speeds = [...$list_of_speeds, speed];
            $list_of_distances = [...$list_of_distances, distance];
            $list_of_angles = [...$list_of_angles, angle];

            console.log(
              `${$list_of_x.length - 2} - ms: ${$list_of_timestamps.at(
                -1
              )}, speed: ${$list_of_speeds.at(
                -1
              )}, distance: ${$list_of_distances.at(
                -1
              )}, angle: ${$list_of_angles.at(-1)}`
            );
          }
        }
      }
    }

    class SceneManager {
      constructor() {
        this.add_primitive_form = this.add_primitive_form.bind(this);
        this.resize = this.resize.bind(this);
        this.populate_scene_with_exercise_forms = this.populate_scene_with_exercise_forms.bind(
          this
        );
        this.create_matrix = this.create_matrix.bind(this);
        this.scale_matrix = this.scale_matrix.bind(this);
        this.rotate_matrix = this.rotate_matrix.bind(this);
        this.position_matrix = this.position_matrix.bind(this);
        this.create_mesh = this.create_mesh.bind(this);
        this.get_world_vertices_from_mesh = this.get_world_vertices_from_mesh.bind(
          this
        );

        this.load_geometry = {
          cube: new THREE.BoxBufferGeometry(1, 1, 1),
          cylinder: new THREE.CylinderBufferGeometry(1, 1, 1, 64),
          cone: new THREE.ConeBufferGeometry(1, 1, 64),
          sphere: new THREE.SphereBufferGeometry(1, 64, 32),
          line: new THREE.BoxBufferGeometry(1, 0.01, 0),
          endpoint: new THREE.RingBufferGeometry(0, 0.025, 30, 1)
        };

        this.scene = new THREE.Scene();
        this.scene.background = null;

        this.camera = new THREE.PerspectiveCamera(
          45,
          $window_size.width / $window_size.height,
          0.1,
          25
        );
        this.camera.position.z = 3;
        this.scene.add(this.camera);

        this.drawing_exercise = document.getElementById("drawing_exercise");
        this.drawing_ctx = this.drawing_exercise.getContext("webgl2");
        this.drawing_ctx.clearColor(0, 0, 0, 0);
        this.drawing_ctx.clear(this.drawing_ctx.COLOR_BUFFER_BIT);

        this.renderer = new THREE.WebGLRenderer({
          antialias: window.devicePixelRatio <= 1,
          powerPreference: "high-performance",
          alpha: true,
          canvas: this.drawing_exercise
        });

        window.addEventListener("resize", this.resize);

        this.resize();
      }

      create_mesh(geometry, color) {
        const material = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.5
        });

        geometry = this.load_geometry[geometry];
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
      }

      scale_matrix(scale) {
        let matrix = new THREE.Matrix4();
        matrix = matrix.scale(new THREE.Vector3(scale.x, scale.y, scale.z));

        return matrix;
      }

      rotate_matrix(rotation) {
        let matrix = new THREE.Matrix4();
        let x = rotation.x * (Math.PI / 180);
        let y = rotation.y * (Math.PI / 180);
        let z = rotation.z * (Math.PI / 180);
        let euler_angle = new THREE.Euler(x, y, z, "XYZ");

        matrix = matrix.makeRotationFromEuler(euler_angle);

        return matrix;
      }

      position_matrix(position) {
        let matrix = new THREE.Matrix4();
        matrix = matrix.setPosition(position.x, position.y, position.z);
        //console.log(matrix);

        return matrix;
      }

      create_matrix(scale, rotation, position) {
        let matrix = new THREE.Matrix4();

        matrix = matrix.scale(new THREE.Vector3(scale.x, scale.y, scale.z));

        let x = rotation.x * (Math.PI / 180);
        let y = rotation.y * (Math.PI / 180);
        let z = rotation.z * (Math.PI / 180);
        let euler_angle = new THREE.Euler(x, y, z, "XYZ");
        matrix = matrix.makeRotationFromEuler(euler_angle);

        matrix = matrix.setPosition(position.x, position.y, position.z);

        return matrix;
      }

      get_world_vertices_from_mesh(mesh, position, rotation, scale) {
        const local_vertices = mesh.geometry.attributes.position.array;
        const world_vertices = [];

        //this works! Do for rotation, translation, and scale matrices
        for (let i = 0; i < local_vertices.length; i += 3) {
          let coords = local_vertices.slice(i, i + 3);
          let vertex = new THREE.Vector3().set(coords[0], coords[1], coords[2]);
          //console.log(coords[0], coords[1], coords[2], vertex);

          vertex = vertex.setFromMatrixPosition(this.position_matrix(position));

          let x = rotation.x * (Math.PI / 180);
          let y = rotation.y * (Math.PI / 180);
          let z = rotation.z * (Math.PI / 180);
          let euler_angle = new THREE.Euler(x, y, z, "XYZ");
          vertex = vertex.setFromEuler(euler_angle);

          vertex = vertex.setFromMatrixScale(this.scale_matrix(scale));

          //console.log(i, local_vertices.slice(i, i + 3), vertex);

          world_vertices.push(vertex);
        }

        //console.log(world_vertices);

        return world_vertices;
      }

      add_primitive_form(geometry, color, position, rotation, scale) {
        let matrix = this.create_matrix(scale, rotation, position);

        let mesh = this.create_mesh(geometry, color);
        mesh.applyMatrix4(matrix);
        mesh.updateMatrixWorld();

        this.scene.add(mesh);
        //add wireframe to scene

        this.scene.updateMatrixWorld();
        console.log(mesh.geometry.attributes.position.array);

        var target = new THREE.Vector3(); // create once an reuse it
        //child.getWorldPosition(target);

        //console.log(v1);

        this.get_world_vertices_from_mesh(mesh, position, rotation, scale);

        //create wireframe for mesh

        switch (geometry) {
          case "cube":
            const list_of_vertices = mesh.geometry.attributes.position.array;
            list_of_cube_edges.forEach(edge => {
              let point1 = new THREE.Vector3();
              const geometry = new THREE.BufferGeometry();
            });
            //console.log(list_of_cube_edges);
            break;
          case "cylinder":
            break;
          case "cone":
            break;
          case "sphere":
            break;
          default:
            break;
        }

        this.renderer.render(this.scene, this.camera);

        return mesh;
      }

      get_grading_criteria_for_form(geometry, mesh) {
        switch (geometry) {
          case "cube":
            cube_edges;
            break;
          default:
            break;
        }
      }

      populate_scene_with_exercise_forms() {
        $list_of_forms.forEach(form => {
          let new_form = this.add_primitive_form(
            form.geometry,
            form.color,
            form.position,
            form.rotation,
            form.scale
          );

          $list_of_meshes.push(new_form);
        });
      }

      resize() {
        this.camera.aspect = $window_size.width / $window_size.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize($window_size.width, $window_size.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        this.renderer.render(this.scene, this.camera);
      }
    }

    const pointer_events = new PointerEvents();
    const scene_manager = new SceneManager();
    scene_manager.populate_scene_with_exercise_forms();
    const driver = new Driver();

    //driver.add_user("bhoutzer@gmail.com");
  });
</script>

<style>
  * {
    background: transparent;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
</style>
