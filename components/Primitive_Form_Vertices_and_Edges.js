export const get_mesh_edges = (mesh) => {
  const coords = mesh.geometry.attributes.position.array;
  const array_of_vertices = {
    left: {
      top: {
        front: -1,
        back: -1
      },
      bottom: {
        front: -1,
        back: -1
      }
    },
    right: {
      top: {
        front: -1,
        back: -1
      },
      bottom: {
        front: -1,
        back: -1
      }
    }
  };

  let x, y, z;

  for (let i = 0; i < coords.length; i += 3) {
    x = coords[i] > 0 ? `right` : `left`;
    y = coords[i + 1] > 0 ? `top` : `bottom`;
    z = coords[i + 2] > 0 ? `front` : `back`;

    if (array_of_vertices[x][y][z] < 0) {
      array_of_vertices[x][y][z] = i / 3;
    }
  }

  return array_of_vertices;
};

export const cube_vertices = {
  left: { top: { front: 5, back: 4 }, bottom: { front: 7, back: 6 } },
  right: { top: { front: 0, back: 1 }, bottom: { front: 2, back: 3 } }
};

export const cube_edges = {
  top: {
    left: Object.values(cube_vertices["left"]["top"]),
    right: Object.values(cube_vertices["right"]["top"]),
    back: [
      cube_vertices["left"]["top"]["back"],
      cube_vertices["right"]["top"]["back"]
    ],
    front: [
      cube_vertices["left"]["top"]["front"],
      cube_vertices["right"]["top"]["front"]
    ]
  },
  bottom: {
    left: Object.values(cube_vertices["left"]["bottom"]),
    right: Object.values(cube_vertices["right"]["bottom"]),
    back: [
      cube_vertices["left"]["bottom"]["back"],
      cube_vertices["right"]["bottom"]["back"]
    ],
    front: [
      cube_vertices["left"]["bottom"]["front"],
      cube_vertices["right"]["bottom"]["front"]
    ]
  }
};

export const list_of_cube_edges = [
  cube_edges["bottom"]["left"],
  cube_edges["bottom"]["right"],
  cube_edges["bottom"]["front"],
  cube_edges["bottom"]["back"],
  cube_edges["top"]["left"],
  cube_edges["top"]["right"],
  cube_edges["top"]["front"],
  cube_edges["top"]["back"]
];
