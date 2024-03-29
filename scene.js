class NodeLight {
    constructor(r, g, b, point, num) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.directional = point ? 1 : 0;
        this.is_the_sun = point;
        this.number = num;


    }
}

class Node {
    constructor( x, y, z, yaw, pitch, roll, s_x, s_y, s_z, data, group ) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.yaw = yaw;
        this.pitch = pitch;
        this.roll = roll;

        this.scale_x = s_x ?? 1;
        this.scale_y = s_y ?? 1;
        this.scale_z = s_z ?? 1;

        this.data = data;

        this.children = [];

        this.render_group = group ?? 0

    }

    add_yaw( amount ) {
        this.yaw += amount;

        if( this.yaw < 0 ) {
            this.yaw = 1 + this.yaw;
        }

        if( this.yaw > 1 ) {
            this.yaw = this.yaw % 1;
        }
    }

    spin_blade( amount ) {
        this.yaw += amount;
    }

    add_pitch( amount ) {
        this.pitch += amount;
        if( this.pitch > this.PITCH_LIMIT ) {
            this.pitch = this.PITCH_LIMIT;
        }
        else if( this.pitch < - this.PITCH_LIMIT ) {
            this.pitch = -this.PITCH_LIMIT;
        }
    }

    change_scale( x, y, z ) {
        this.scale_x = x;
        this.scale_y = y;
        this.scale_z = z;
    }

    orbit_roll( amount ) {
        this.roll += amount;
    }

    add_roll( amount ) {
        this.roll += amount;

        if( this.roll < -.5 ) { this.roll = -.5; }
        if( this.roll > 5 ) { this.roll = .5; }
    }

    move_in_direction( strafe, up, forward ) {
        let matrix = Node.get_dir_matrix( this.roll, this.pitch, this.yaw );
        let txed = matrix.transform_vec( new Vec4( strafe, up, forward, 0 ) );

        this.translate_vec( txed );
    }

    translate( x, y, z ) {
        this.x += x;
        this.y += y;
        this.z += z;
    }

    translate_vec( v ) {
        this.translate( v.x, v.y, v.z );
    }

    warp( x, y, z ) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    warp_vec( v ) {
        this.warp( v.x, v.y, v.z );
    }

    static get_dir_matrix( roll, pitch, yaw ) {
        let matrix = new Mat4();


        matrix = matrix.mul( Mat4.rotation_xz( yaw ) );
        matrix = matrix.mul( Mat4.rotation_yz( pitch ) );
        matrix = matrix.mul( Mat4.rotation_xy( roll ) );

        return matrix;
    }

    get_matrix() {
        let matrix = new Mat4();

        // note: I deliberately changed the order here by applying scale last, so that I could
        // do the "breathing" effect.
        matrix = matrix.mul( Mat4.translation( this.x, this.y, this.z ) );

        matrix = matrix.mul( Mat4.rotation_xz( this.yaw ) );
        matrix = matrix.mul( Mat4.rotation_yz( this.pitch ) );
        matrix = matrix.mul( Mat4.rotation_xy( this.roll ) );

        matrix = matrix.mul( Mat4.scale( this.scale_x, this.scale_y, this.scale_z ) );


        return matrix;
    }

    get_view_matrix() {
        return this.get_matrix().inverse();
    }

    create_child_node( x, y, z, yaw, pitch, roll, s_x, s_y, s_z, data, group) {
        let child = new Node( x, y, z, yaw, pitch, roll, s_x, s_y, s_z, data, group);
        this.children.push( child );

        return child;
    }

    get_transformed_coordinates() {
        let matrix = this.get_matrix();

        return matrix.get_transformed_coordinates();
    }

    generate_render_batch( parent_matrix, jobs, lights, camera_view) {
        let matrix = parent_matrix.mul( this.get_matrix() );

        if( this.data instanceof NodeLight ) {
            if( !this.data.is_the_sun ) {
                let coords = matrix.get_transformed_coordinates();
                lights[this.render_group].push( new RenderLight( coords, this.data ) );
            }
        }
        else if( this.data instanceof NormalMesh ) {
            jobs[this.render_group].push( new RenderMesh( matrix, this.data, this.render_group ) )
        }
        else if (this.render_group === -1) {
            camera_view.push(matrix.inverse());
        }
        else if( this.data == null ) {
            // console.log(this);
            // do nothing
        }
        else {
            console.log( this );
            throw new Error(
                'unrecognized node data: ' +
                this.data.constructor.name + ' (' + this.data + ').'
            );
        }

        for( let child of this.children ) {
            child.generate_render_batch( matrix, jobs, lights, camera_view );
        }
    }
}

class RenderLight {
    constructor( loc, color ) {
        this.loc = loc;
        this.color = color;
    }
}

class RenderMesh {
    constructor( matrix, mesh, render_group ) {
        this.matrix = matrix;
        this.mesh = mesh;
        this.render_group = render_group
    }
}

class Scene {

    constructor() {
        this.root = new Node( 0, 0, 0, 0, 0, 0, 1, 1, 1, undefined, 0 );
        this.camera_node = this.root.create_child_node( 10, 10, -20, 0, 0, 0, 1, 1, 1, undefined, -1 );
        this.sun_node =
            this.root.create_child_node(
                0, 1, 0, 0, 0, 0, 1, 1, 1, new NodeLight( 1, 1, 1, true ), 0 );
    }

    set_sun_color( r, g, b ) {
        let l = this.sun_node.data;
        l.r = r;
        l.g = g;
        l.b = b;
    }

    set_sun_direction( x, y, z ) {
        let l = this.sun_node;
        l.x = x;
        l.y = y;
        l.z = z;
    }

    /**
     * Attach the sun's direction and color to the given program.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     */
    bind_sun( gl, program ) {
        let sun = this.sun_node;
        let loc = sun.get_transformed_coordinates().norm();

        set_uniform_vec3( gl, program, 'sun_dir', loc.x, loc.y, loc.z );
        set_uniform_vec3( gl, program, 'sun_color', sun.data.r, sun.data.g, sun.data.b );
    }

    generate_render_batch( jobs, lights, camera_view) {
        this.root.generate_render_batch( Mat4.identity(), jobs, lights, camera_view );
    }

    get_camera_view() {
        return this.camera_node.get_view_matrix();
    }

    set_camera_node( node ) {
        this.camera_node = node;
    }

    create_node( x, y, z, yaw, pitch, roll, s_x, s_y, s_z, data, group) {
        let node = this.root.create_child_node( x, y, z, yaw, pitch, roll, s_x, s_y, s_z, data, group);
        return node;
    }

}