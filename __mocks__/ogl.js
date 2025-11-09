class MockRenderer {
	constructor() {
		this.gl = {
			canvas: {
				width: 0,
				height: 0,
				getContext: () => ({}),
			},
			clearColor: () => {},
			clear: () => {},
			getParameter: () => 1,
		};
	}
	setSize() {
		/* noop */
	}
	render() {
		/* noop */
	}
}

class MockProgram {
	constructor() {
		this.uniforms = {};
	}
}

class MockMesh {
	constructor() {
		this.rotation = { z: 0 };
		this.position = { set: () => {} };
		this.scale = { set: () => {} };
	}
}

class MockTriangle {}

class MockVec3 {
	constructor(x = 0, y = 0, z = 0) {
		this.value = [x, y, z];
	}
}

module.exports = {
	Renderer: MockRenderer,
	Program: MockProgram,
	Mesh: MockMesh,
	Triangle: MockTriangle,
	Vec3: MockVec3,
};
