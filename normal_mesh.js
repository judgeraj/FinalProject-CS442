
const VERTEX_STRIDE = 48;

class NormalMesh {
    /** 
     * Creates a new mesh and loads it into video memory.
     * 
     * @param {WebGLRenderingContext} gl  
     * @param {number} program
     * @param {number[]} vertices
     * @param {number[]} indices
    */
    constructor( gl, program, vertices,indices, material, use_color, tex_coords, norm_coords) {
        this.vertices = create_and_load_vertex_buffer(gl, vertices, gl.STATIC_DRAW);
        this.indis = create_and_load_elements_buffer(gl, indices, gl.STATIC_DRAW);

        this.n_verts = vertices.length / VERTEX_STRIDE * 4;
        this.n_indis = indices.length;

        // console.log(this.n_verts, this.n_indis);

        this.program = program;
        this.material = material;
        this.use_color = use_color ?? false;

        this.tex_coords = create_and_load_elements_buffer(gl, tex_coords, gl.STATIC_DRAW);
        this.norm_coords = create_and_load_elements_buffer(gl, norm_coords, gl.STATIC_DRAW);
    }

    set_vertex_attributes() {
        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "coordinates", 
            this.vertices, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 0
        );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "color", 
            this.vertices, 4,
            gl.FLOAT, false, VERTEX_STRIDE, 16
        );

        set_vertex_attrib_to_buffer( 
            gl, this.program,
            "uv",
            this.vertices, 2,
            gl.FLOAT, false, VERTEX_STRIDE, 28
        );

        set_vertex_attrib_to_buffer(
            gl, this.program, 
            "surf_normal",
            this.vertices, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 36
        );
    }
    

    /**
     * Create a box mesh with the given dimensions and colors. Creates normals.
     * @param {WebGLRenderingContext} gl 
     */

    static box( gl, program, width, height, depth, material ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            hwidth, -hheight, -hdepth,  1.0, 0.0, 1.0, 1.0,     1.0, 1.0,   0.0, 0.0, -1.0,
            -hwidth, -hheight, -hdepth, 0.0, 1.0, 1.0, 1.0,     0.0, 1.0,   0.0, 0.0, -1.0,
            -hwidth, hheight, -hdepth,  0.5, 0.5, 1.0, 1.0,     0.0, 0.0,   0.0, 0.0, -1.0,
            hwidth, hheight, -hdepth,   1.0, 1.0, 0.5, 1.0,     1.0, 0.0,   0.0, 0.0, -1.0,

            hwidth, -hheight, hdepth,   1.0, 0.0, 1.0, 1.0,     1.0, 1.0,   1.0, 0.0, 0.0,
            hwidth, -hheight, -hdepth,  0.0, 1.0, 1.0, 1.0,     0.0, 1.0,   1.0, 0.0, 0.0,
            hwidth, hheight, -hdepth,   0.5, 0.5, 1.0, 1.0,     0.0, 0.0,   1.0, 0.0, 0.0,
            hwidth, hheight, hdepth,    1.0, 1.0, 0.5, 1.0,     1.0, 0.0,   1.0, 0.0, 0.0,

            -hwidth, -hheight, hdepth,  1.0, 0.0, 1.0, 1.0,     1.0, 1.0,   0.0, 0.0, 1.0,
            hwidth, -hheight, hdepth,   1.0, 1.0, 0.5, 1.0,     0.0, 1.0,   0.0, 0.0, 1.0,
            hwidth, hheight, hdepth,    0.5, 0.5, 1.0, 1.0,     0.0, 0.0,   0.0, 0.0, 1.0,
            -hwidth, hheight, hdepth,   0.0, 1.0, 1.0, 1.0,     1.0, 0.0,   0.0, 0.0, 1.0,
            
            -hwidth, -hheight, hdepth,  1.0, 0.0, 1.0, 1.0,     0.0, 1.0,   -1.0, 0.0, 0.0,
            -hwidth, -hheight, -hdepth, 0.0, 1.0, 1.0, 1.0,     1.0, 1.0,   -1.0, 0.0, 0.0,
            -hwidth, hheight, -hdepth,  0.5, 0.5, 1.0, 1.0,     1.0, 0.0,   -1.0, 0.0, 0.0,
            -hwidth, hheight, hdepth,   1.0, 1.0, 0.5, 1.0,     0.0, 0.0,   -1.0, 0.0, 0.0,

            -hwidth, hheight, -hdepth,  1.0, 0.0, 0.0, 1.0,     0.0, 1.0,   0.0, 1.0, 0.0,
            hwidth, hheight, -hdepth,   0.0, 1.0, 0.0, 1.0,     1.0, 1.0,   0.0, 1.0, 0.0,
            hwidth, hheight, hdepth,    0.0, 0.0, 1.0, 1.0,     1.0, 0.0,   0.0, 1.0, 0.0,
            -hwidth, hheight, hdepth,   1.0, 1.0, 0.0, 1.0,     0.0, 0.0,   0.0, 1.0, 0.0,

            -hwidth, -hheight, -hdepth, 1.0, 0.0, 0.0, 1.0,     0.0, 1.0,   0.0, -1.0, 0.0,
            hwidth, -hheight, -hdepth,  0.0, 1.0, 0.0, 1.0,     1.0, 1.0,   0.0, -1.0, 0.0,
            hwidth, -hheight, hdepth,   0.0, 0.0, 1.0, 1.0,     1.0, 0.0,   0.0, -1.0, 0.0,
            -hwidth, -hheight, hdepth,  1.0, 1.0, 0.0, 1.0,     0.0, 0.0,   0.0, -1.0, 0.0,
        ];

        let indis = [
            // clockwise winding
            0, 3, 2, 2, 1, 0,
            4, 7, 6, 6, 5, 4,
            8, 11, 10, 10, 9, 8,
            12, 13, 14, 14, 15, 12,
            16, 17, 18, 18, 19, 16,
            20, 23, 22, 22, 21, 20,
        ];

        let tex_coords = [indis.length].fill(0);
        let norm_coords = [indis.length].fill(0);

        return new NormalMesh( gl, program, verts, indis, material, false, tex_coords, norm_coords);
    }


    /**
     * Create a flat platform in the xz plane.
     * @param {WebGLRenderingContext} gl
     */
    static triangle( gl, program, width, depth, uv_min, uv_max, material ) {
        let hwidth = width / 2;
        let hdepth = depth / 2;

        let verts = [
            0, 0, 0,   1.0, 1.0, 1.0, 1.0,     uv_min, uv_max,   0.0, 1.0, 0.0,
            0, 1, 0,     1.0, 1.0, 1.0, 1.0,     uv_max, uv_max,   0.0, 1.0, 0.0,
            1, 0, 0,      1.0, 1.0, 1.0, 1.0,     uv_max, uv_min,   0.0, 1.0, 0.0,
        ];

        let indis = [ 0, 1, 2, ];

        return new NormalMesh( gl, program, verts, indis, material, false );
    }


    /**
     * Create a flat platform in the xz plane.
     * @param {WebGLRenderingContext} gl 
     */
    static platform( gl, program, width, depth, uv_min, uv_max, material ) {
        let hwidth = width / 2;
        let hdepth = depth / 2;
        
        let verts = [
            -hwidth, 0, -hdepth,  1.0, 1.0, 1.0, 1.0,     uv_min, uv_max,   0.0, 1.0, 0.0,
            hwidth, 0, -hdepth,   1.0, 1.0, 1.0, 1.0,     uv_max, uv_max,   0.0, 1.0, 0.0,
            hwidth, 0, hdepth,    1.0, 1.0, 1.0, 1.0,     uv_max, uv_min,   0.0, 1.0, 0.0,
            -hwidth, 0, hdepth,   1.0, 1.0, 1.0, 1.0,     uv_min, uv_min,   0.0, 1.0, 0.0,
        ];

        let indis = [ 0, 1, 2, 2, 3, 0, ];

        return new NormalMesh( gl, program, verts, indis, material, false );
    }

    /**
     * Load a mesh from a heightmap.
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program
     * @param {number][][]} map
     * @param {number} min 
     * @param {number} max
     */
    static from_heightmap( gl, program, map, min, max, material ) {
        let rows = map.length;
        let cols = map[0].length;
        const MIN_HEIGHT_COLOR = 0.2;

        let off_x = cols / 2;
        let off_z = rows / 2;

        let verts = [];
        let indis = [];

        function color( height ) {
            let normed_height = height / ( max - min );
            return MIN_HEIGHT_COLOR + normed_height * ( 1 - MIN_HEIGHT_COLOR );
        }

        function push_vert( verts, vert, u, v, normal ) {
            verts.push( vert.x, vert.y, vert.z );
            let vert_bright = color( vert.y );
            verts.push( vert_bright, vert_bright, vert_bright, 1.0 );
            verts.push( u, v );
            verts.push( normal.x, normal.y, normal.z );
        }

        for( let row = 1; row < rows; row++ ) {
            for( let col = 1; col < cols; col++ ) {
                let indi_start = indis.length;

                let pos_tl = map[row - 1][col - 1];
                let pos_tr = map[row - 1][col];
                let pos_bl = map[row][col - 1];
                let pos_br = map[row][col];

                let v_tl = new Vec4( -1, pos_tl, -1 );
                let v_tr = new Vec4( 0, pos_tr, -1 );
                let v_bl = new Vec4( -1, pos_bl, 0 );
                let v_br = new Vec4( 0, pos_br, 0 );

                let normal_t1 = Vec4.normal_of_triangle( v_tl, v_tr, v_bl );
                let normal_t2 = Vec4.normal_of_triangle( v_br, v_bl, v_tr );

                // debug
                // normal_t1 = new Vec4( 0, 1, 0 );
                // normal_t2 = new Vec4( 0, 1, 0 );

                v_tl.x += col - off_x;
                v_tl.z += row - off_z;
                v_tr.x += col - off_x;
                v_tr.z += row - off_z;
                v_bl.x += col - off_x;
                v_bl.z += row - off_z;
                v_br.x += col - off_x;
                v_br.z += row - off_z;

                push_vert( verts, v_tl, 0, 1, normal_t1 );
                push_vert( verts, v_tr, 1, 1, normal_t1 );
                push_vert( verts, v_bl, 0, 0, normal_t1 );

                push_vert( verts, v_br, 1, 0, normal_t2 );
                push_vert( verts, v_bl, 0, 0, normal_t2 );
                push_vert( verts, v_tr, 1, 1, normal_t2 );

                indis.push( 
                    indi_start,
                    indi_start + 1,
                    indi_start + 2,
                    indi_start + 3,
                    indi_start + 4,
                    indi_start + 5
                );
            }
        }

        return new NormalMesh( gl, program, verts, indis, material, true );
    }

    /**
     * Render the mesh. Does NOT preserve array/index buffer, program, or texture bindings! 
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render( gl ) {
        // gl.enable( gl.FRONT_AND_BACK );
        // gl.frontFace();

        gl.useProgram( this.program );
        this.set_vertex_attributes();
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertices);
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indis );

        bind_texture_samplers( gl, this.program, "tex_0" );

        gl.activeTexture( gl.TEXTURE0 );
        this.material.bind( gl, this.program );

        set_uniform_int( gl, this.program, 'use_color', this.use_color );

        gl.drawElements( gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0 );
        // gl.drawElements( gl.TRIANGLES, this.tex_coords, gl.UNSIGNED_SHORT, 0 );
        // gl.drawElements( gl.TRIANGLES, this.norm_coords, gl.UNSIGNED_SHORT, 0 );

    }
    static uv_cylinder( gl, program, radius, subdivisions, material ,flip) {
        let verts = [];
        let indices = [];
        let TAU = 2 * Math.PI;

        let angle = Math.PI / 2;
        let adjustment_diff = -(Math.PI/subdivisions)

        for ( let layer = 0; layer <= subdivisions; layer++ ) {

            let y_turns = layer / subdivisions / 2;
            let y = Math.cos(y_turns * TAU);
            y *= radius;

            for ( let subdiv = 0; subdiv <= subdivisions; subdiv++ ) {

                // let adjustment = Math.cos(angle);

                let turns = subdiv/subdivisions;
                let rads = turns * TAU;

                let x = Math.cos(rads) * radius;
                let z = Math.sin(rads) * radius;

                let u = subdiv / subdivisions;
                let v = layer / subdivisions;

                // console.log(x,y,z);

                verts.push(x,y,z);
                verts.push(1, 1, 1, 1);
                verts.push(u, v);
                if (flip) {
                    verts.push(-x,-y,-z);
                } else {
                    verts.push(x,y,z);
                }

            }

            angle += adjustment_diff;

        }

        // console.log(verts);
        for ( let layer = 0; layer < subdivisions; layer++ ) {
            let index = layer * (subdivisions + 1);
            let index_2 = index + subdivisions + 1;
            for ( let subdiv = 0; subdiv < subdivisions; subdiv++ ) {
                //adding one indice starting from the upper layer
                indices.push(index);
                //adding 2nd indice from the lower layer
                indices.push(index_2);
                //adding third indice starting from the upper layer and over 1 position
                indices.push(index + 1);

                //starting from the upper layer indice + 1
                indices.push(index + 1);
                //lower layer indice directly below index
                indices.push(index_2);
                //adding third indice of 2nd triangle from the lower layer + 1
                indices.push(index_2 + 1);

                index_2++;
                index++;

            }
        }
        // console.log(indices)
        return new NormalMesh( gl, program, verts, indices, material, false );
    }

    /**
     * Create a UV sphere.
     * @param {*} gl 
     * @param {*} program 
     * @param {*} radius 
     * @param {*} subdivs the number of subdivisions, both vertically and radially
     * @param {*} material 
     * @returns 
     */
    static uv_sphere( gl, program, radius, subdivs, material ) {
        if( subdivs < 3 ) {
            throw new Error( "subdivs must be at least 3. value: " + subdivs );
        }

        let verts = []
        let indis = []

        for( let layer = 0; layer <= subdivs; layer++ ) {
            // let y = layer / subdivs - 0.5;
            let y_turns = layer /  subdivs / 2;
            let y = Math.cos( 2 * Math.PI * y_turns ) / 2;
            let radius_scale_for_layer = Math.sin( 2 * Math.PI * y_turns );

            for( let subdiv = 0; subdiv <= subdivs; subdiv++ ) {
                let turns = subdiv / subdivs;
                let rads = 2 * Math.PI * turns;

                let x = Math.cos( rads ) / 2 * radius_scale_for_layer;
                let z = Math.sin( rads ) / 2 * radius_scale_for_layer;

                let point_norm = new Vec4( x, y, z, 0.0 ).norm();
                let scaled_point = point_norm.scaled( radius );

                // coordinates
                verts.push( scaled_point.x, scaled_point.y, scaled_point.z );

                // console.log( layer, subdiv, scaled_point.x, scaled_point.y, scaled_point.z );

                // color (we're making it white for simplicity)
                verts.push( 1, 1, 1, 1 );

                // uvs
                verts.push( subdiv / subdivs, layer / subdivs );

                // normal vector. make sure you understand why the normalized coordinate is
                // equivalent to the normal vector for the sphere.
                verts.push( point_norm.x, point_norm.y, point_norm.z );
            }
        }

        function get_indi_no_from_layer_and_subdiv_no( layer, subdiv ) {
            let layer_start = layer * ( subdivs + 1 );
            return layer_start + subdiv % ( subdivs + 1 );
        }

        for( let layer = 1; layer <= subdivs; layer++ ) {
            for( let subdiv = 0; subdiv < subdivs; subdiv++ ) {
                let i0 = get_indi_no_from_layer_and_subdiv_no( layer - 1, subdiv );
                let i1 = get_indi_no_from_layer_and_subdiv_no( layer - 1, subdiv + 1 );
                let i2 = get_indi_no_from_layer_and_subdiv_no( layer, subdiv );
                let i3 = get_indi_no_from_layer_and_subdiv_no( layer, subdiv + 1 );

                indis.push( i0, i2, i3, i3, i1, i0 );
            }
        }

        return new NormalMesh( gl, program, verts, indis, material, false );
    }

    /**
     * Parse the given text as the body of an obj file.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} text
     */
    static from_obj_text( gl, program, text, material ) {
        let lines = text.split( /\r?\n/ );

        let verts = [];
        let color = [];
        let vertex_normals = [];
        let uv_verts = [];

        let index = [];
        let tex_coords = [];
        let norm_coords = [];

        for( let line of lines ) {
            let trimmed = line.trim();
            let parts = trimmed.split( /(\s+)/ );

            if(
                parts === null || parts.length < 2 ||
                parts[0] === '#' || parts[0] === '' )
            {
                continue;
            }
            else if( parts[0] === 'v' ) {
                verts.push( parseFloat( parts[2] ) );
                verts.push( parseFloat( parts[4] ) );
                verts.push( parseFloat( parts[6] ) );
                // color data
                color.push( 1, 1, 1, 1 );
                // verts.push(0,0);
                // verts.push(0,0,0);
            } else if ( parts[0] === 'f' ) {
                // console.log(parseInt(parts[2]) - 1,parts[4], parts[6]);
                // index.push(parseInt(parts[2]) - 1, parseInt(parts[4]) - 1, parseInt(parts[6]) - 1);
                parts.forEach( part => {
                    if (part !== 'f' && part !== ' ') {

                        let indices = part.split('/');
                        //console.log(indices[0]);
                        index.push(parseInt(indices[0]) - 1);//, parseFloat(indices[1]), parseFloat(indices[2])
                        tex_coords.push(parseInt(indices[1]));
                        norm_coords.push(parseInt(indices[2]));
                        // // console.log(indices);
                        // // console.log(indices)
                        // //
                        // if ( indices[0] !== '' ) {
                        //     // console.log(norm_coords)
                        //     index.push(parseInt(indices[0]) - 1);//, parseFloat(indices[1]), parseFloat(indices[2])
                        // } else {
                        //     index.push(parseInt('0'));//, parseFloat(indices[1]), parseFloat(indices[2])
                        // }
                        //
                        // if ( indices[1] !== '' ) {
                        //     tex_coords.push(parseInt(indices[1]));
                        // } else {
                        //     tex_coords.push(parseInt('0'));
                        // }
                        //
                        // if ( indices[2] !== '') {
                        //     norm_coords.push(parseInt(indices[2]));
                        // } else {
                        //     norm_coords.push(parseInt('0'));
                        // }


                    }
                });
            } else if( parts[0] === 'vt' ) {
                // console.log(parts[2], parts[4])
                uv_verts.push(parseFloat(parts[2]), parseFloat(parts[4]));
            } else if( parts[0] === 'vn' ) {
                vertex_normals.push(parseFloat(parts[2]),parseFloat(parts[4]),parseFloat(parts[6]));
            }
        }
        let color_index = 0;
        let uv_index = 0;
        let v_normal_index = 0;

        let finalverts = [];

        for (let i = 0; i <= verts.length - 2; i+=3) {
            finalverts.push(verts[i],verts[i+1],verts[i+2]);
            finalverts.push(color[color_index],color[color_index+1],color[color_index+2],color[color_index+3]);
            finalverts.push(uv_verts[uv_index], uv_verts[uv_index+1]);
            finalverts.push(vertex_normals[v_normal_index],vertex_normals[v_normal_index+1],vertex_normals[v_normal_index+2]);
            color_index+=4;
            uv_index+=2;
            v_normal_index+=3;
        }

        //console.log( verts.slice(540, 600) )
        // console.log( indis.slice(540, 600) )
        console.log(finalverts);
        console.log(index);
        // console.log(norm_coords);
        // console.log(tex_coords);
        //console.log(finalverts)

        return new NormalMesh( gl, program, finalverts, index, material, false, tex_coords, norm_coords);
    }

    /**
     * Asynchronously load the obj file as a mesh.
     * @param {WebGLRenderingContext} gl
     * @param {string} file_name
     * @param {WebGLProgram} program
     * @param {function} f the function to call and give mesh to when finished.
     */
    static from_obj_file( gl, file_name, program, f, material ) {
        let request = new XMLHttpRequest();
        // console.log(f)

        // the function that will be called when the file is being loaded
        request.onreadystatechange = function() {
            // console.log( request.readyState );

            if( request.readyState != 4 ) { return; }
            if( request.status != 200 ) {
                throw new Error( 'HTTP error when opening .obj file: ', request.statusText );
            }

            // now we know the file exists and is ready
            let loaded_mesh = NormalMesh.from_obj_text( gl, program, request.responseText, material);

            console.log( 'loaded ', file_name );
            // console.log(f)
            f( loaded_mesh );
        };

        request.open( 'GET', file_name ); // initialize request.
        request.send();                   // execute request
    }

    /**
     *
     * @param scale
     * @param roughness
     * @param min_height
     * @param max_height
     * @param center_row
     * @param center_col
     * @returns {*[]}
     */

    // static diamond_square(map, roughness, min_height, max_height, center_row, center_col, start_row, start_col, ending_row, ending_col) {
    //
    //     if (center_col < 1) {
    //         return;
    //     }
    //     console.log(center_row,center_col, map);
    //
    //     let random_offset = Math.random() * (max_height - min_height) - min_height;
    //     //diamond step
    //     let top = start_col;
    //     let left = start_col;
    //     let right = ending_col;
    //     let bot = ending_col;
    //     console.log(top,left,right,bot)
    //     //diamond step
    //     map[center_row][center_col] =
    //                    (map[top][left] +
    //                     map[top][right] +
    //                     map[bot][left] +
    //                     map[bot][right])/4 + random_offset;
    //
    //     console.log(map);
    //
    //     //square step
    //     let radius = center_row - start_row;
    //
    //     // north_node
    //     // if(start_row < 2) {
    //     //     map[start_row][center_col] =
    //     //         map[start_row][center_col] + //north of north node
    //     //         map[start_row][center_col] + //east of north node
    //     //         map[][] + //west of north node
    //     //         map[center_row][center_row]; //south of north node
    //     // }
    //     // south node bot right/2
    //     // map[ending_row][radius]
    //     // // east node bot/2 right
    //     // map[radius][ending_col]
    //     // // west node bot/2 top
    //     // map[radius][start_row]
    //
    //
    //     this.diamond_square();
    //     this.diamond_square();
    //     this.diamond_square();
    //     this.diamond_square();
    //
    //     return map;
    //
    // }



}

/*
       //loop until we fill the array
        while (partition_size > 1) {
            let random_offset = Math.random() * (max_height - min_height) + min_height * roughness;
            let half_steps = partition_size/2;
            //diamond step
            for (let row = 0; row < partition_size; row+=partition_size) {
                for (let col = 0; col < partition_size; col+=partition_size) {
                    let avg = map[row][col] +
                        map[row][partition_size] +
                        map[partition_size][row] +
                        map[partition_size][partition_size];
                    map[center_row][center_col] = (avg/4) * random_offset;
                }
            }

            // //square step
            for (let row = 0; row < partition_size; row+=half_steps) {
                for (let col = (row + half_steps) % partition_size; col < partition_size; col+=partition_size) {
                    console.log(row, col);
                    if (row > 0 && row < partition_size) {
                        // console.log(row - half_steps)
                        // map[row][col] =
                        //     map[row][] + //top left
                        //     map[][] + //top right
                        //     map[][] + //bot left
                        //     map[][]; //bot right
                    }
                    if (col > 0 && col < partition_size) {

                    }
                }
            }
            partition_size /= 2;
            roughness /= 2;
        }
 */

