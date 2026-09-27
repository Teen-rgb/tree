/* ==========================================
   PRODUCT DATA
========================================== */

const products = [

    {
        id: "cpu1",
        name: "AMD Ryzen 5 5600",
        category: "CPU",
        price: 4990,
        icon: "🧠"
    },

    {
        id: "cpu2",
        name: "Intel Core i5-13400F",
        category: "CPU",
        price: 5990,
        icon: "🧠"
    },

    {
        id: "vga1",
        name: "ASUS TUF RTX 3060",
        category: "VGA",
        price: 12990,
        icon: "🎮"
    },

    {
        id: "vga2",
        name: "MSI RTX 4060",
        category: "VGA",
        price: 15990,
        icon: "🎮"
    },

    {
        id: "ram1",
        name: "Kingston Fury Beast 16GB",
        category: "RAM",
        price: 1890,
        icon: "▰"
    },

    {
        id: "ram2",
        name: "Corsair Vengeance 16GB",
        category: "RAM",
        price: 2190,
        icon: "▰"
    },

    {
        id: "ssd1",
        name: "Samsung 980 1TB",
        category: "Storage",
        price: 2990,
        icon: "💾"
    },

    {
        id: "hdd1",
        name: "Seagate 2TB",
        category: "Storage",
        price: 1590,
        icon: "💿"
    }

];


/* ==========================================
   PRODUCT SYSTEM
========================================== */

let selectedCategory = "ทั้งหมด";


function money(number) {

    return "฿" +
        number.toLocaleString("th-TH");

}



function renderProducts(elementId, limit = null) {

    const element =
        document.getElementById(elementId);

    if (!element) return;


    let list = [...products];


    if (selectedCategory !== "ทั้งหมด") {

        list =
            list.filter(
                product =>
                    product.category === selectedCategory
            );

    }


    const search =
        document
            .getElementById("searchInput")
            ?.value
            .toLowerCase() || "";


    if (search !== "") {

        list =
            list.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.category
                    .toLowerCase()
                    .includes(search)

            );

    }


    if (limit) {

        list =
            list.slice(0, limit);

    }


    if (list.length === 0) {

        element.innerHTML =
            "<p>ไม่พบสินค้าที่ค้นหา</p>";

        return;

    }


    element.innerHTML =
        list.map(product => `

            <div class="product-card">

                <div class="product-img">
                    ${product.icon}
                </div>

                <span class="cat">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <div class="price">
                    ${money(product.price)}
                </div>

                <button
                    class="btn"
                    onclick="showProduct('${product.id}')">

                    ดูรายละเอียด

                </button>

            </div>

        `).join("");

}



function showProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    alert(
        "สินค้า: " +
        product.name +
        "\nราคา: " +
        money(product.price) +
        "\nหมวดหมู่: " +
        product.category
    );

}



function renderCategories() {

    const element =
        document.getElementById("categories");

    if (!element) return;


    const categories = [

        "ทั้งหมด",

        ...new Set(
            products.map(
                product =>
                    product.category
            )
        )

    ];


    element.innerHTML =
        categories.map(category => `

            <button
                class="${
                    category === selectedCategory
                    ? "active"
                    : ""
                }"
                onclick="
                    chooseCategory('${category}')
                ">

                ${category}

            </button>

        `).join("");

}



function chooseCategory(category) {

    selectedCategory =
        category;

    renderCategories();

    renderProducts(
        "allProducts"
    );

}



function filterProducts() {

    renderProducts(
        "allProducts"
    );

}


/* ==========================================
   GRAPH THEORY
==========================================

   Vertex = อุปกรณ์

   Edge = ความสัมพันธ์ระหว่างอุปกรณ์

   Adjacency List =
   โครงสร้างที่ใช้เก็บ Neighbor
*/


const graph = {

    CPU: [
        "RAM",
        "SSD",
        "VGA"
    ],

    RAM: [
        "CPU",
        "SSD",
        "VGA"
    ],

    SSD: [
        "CPU",
        "RAM",
        "HDD"
    ],

    VGA: [
        "CPU",
        "RAM",
        "Monitor"
    ],

    HDD: [
        "SSD",
        "Monitor"
    ],

    Monitor: [
        "VGA",
        "HDD",
        "Keyboard"
    ],

    Keyboard: [
        "Monitor",
        "Mouse"
    ],

    Mouse: [
        "Keyboard",
        "Monitor"
    ]

};



/* ตำแหน่ง Vertex */

const positions = {

    CPU: [10, 15],

    RAM: [43, 8],

    SSD: [75, 15],

    VGA: [25, 50],

    HDD: [60, 50],

    Monitor: [88, 50],

    Keyboard: [25, 82],

    Mouse: [70, 82]

};



/* ==========================================
   INITIAL GRAPH PAGE
========================================== */

function initGraphPage() {

    const adjacency =
        document.getElementById(
            "adjacencyList"
        );


    if (adjacency) {

        adjacency.textContent =

            Object.entries(graph)

                .map(
                    ([vertex, neighbors]) =>

                        vertex +
                        " → [" +
                        neighbors.join(", ") +
                        "]"
                )

                .join("\n");

    }


    const start =
        document.getElementById(
            "startNode"
        );


    const end =
        document.getElementById(
            "endNode"
        );


    Object.keys(graph).forEach(vertex => {

        start.innerHTML +=
            `<option>${vertex}</option>`;

        end.innerHTML +=
            `<option>${vertex}</option>`;

    });


    end.value =
        "Monitor";


    drawGraph();

}



/* ==========================================
   DRAW GRAPH
========================================== */

function drawGraph(path = []) {

    const canvas =
        document.getElementById(
            "graphCanvas"
        );


    if (!canvas) return;


    canvas.innerHTML = "";


    const createdEdges =
        new Set();


    Object.entries(graph)
        .forEach(([from, neighbors]) => {

            neighbors.forEach(to => {

                const key =
                    [from, to]
                        .sort()
                        .join("-");


                if (
                    createdEdges.has(key)
                ) return;


                createdEdges.add(key);


                const
                    [x1, y1] =
                        positions[from];


                const
                    [x2, y2] =
                        positions[to];


                const dx =
                    x2 - x1;


                const dy =
                    y2 - y1;


                const length =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                const angle =
                    Math.atan2(
                        dy,
                        dx
                    ) *
                    180 /
                    Math.PI;


                const edge =
                    document.createElement(
                        "div"
                    );


                edge.className =
                    "edge";


                edge.style.left =
                    x1 + "%";


                edge.style.top =
                    y1 + "%";


                edge.style.width =
                    length + "%";


                edge.style.transform =
                    `rotate(${angle}deg)`;


                canvas.appendChild(edge);

            });

        });



    Object.entries(positions)
        .forEach(([name, position]) => {

            const node =
                document.createElement(
                    "div"
                );


            node.className =
                "node";


            if (
                path.includes(name)
            ) {

                node.classList.add(
                    "highlight"
                );

            }


            node.style.left =
                `calc(${position[0]}% - 40px)`;


            node.style.top =
                `calc(${position[1]}% - 40px)`;


            node.textContent =
                name;


            canvas.appendChild(node);

        });

}



/* ==========================================
   BFS
========================================== */

function BFS(start, target) {

    const queue = [

        [start, [start]]

    ];


    const visited =
        new Set([start]);


    while (queue.length > 0) {

        const [
            current,
            path
        ] = queue.shift();


        if (
            current === target
        ) {

            return path;

        }


        for (
            const neighbor
            of graph[current]
        ) {

            if (
                !visited.has(
                    neighbor
                )
            ) {

                visited.add(
                    neighbor
                );


                queue.push([

                    neighbor,

                    [
                        ...path,
                        neighbor
                    ]

                ]);

            }

        }

    }


    return [];

}



/* ==========================================
   DFS
========================================== */

function DFS(start, target) {

    const visited =
        new Set();


    function search(
        current,
        path
    ) {

        if (
            current === target
        ) {

            return path;

        }


        visited.add(current);


        for (
            const neighbor
            of graph[current]
        ) {

            if (
                !visited.has(
                    neighbor
                )
            ) {

                const result =
                    search(

                        neighbor,

                        [
                            ...path,
                            neighbor
                        ]

                    );


                if (result.length > 0) {

                    return result;

                }

            }

        }


        return [];

    }


    return search(
        start,
        [start]
    );

}



/* ==========================================
   RUN BFS / DFS
========================================== */

function runSearch(type) {

    const start =
        document.getElementById(
            "startNode"
        ).value;


    const target =
        document.getElementById(
            "endNode"
        ).value;


    let path;


    if (type === "BFS") {

        path =
            BFS(
                start,
                target
            );

    } else {

        path =
            DFS(
                start,
                target
            );

    }


    const result =
        document.getElementById(
            "searchResult"
        );


    result.innerHTML = `

        <strong>
            Algorithm: ${type}
        </strong>

        <br><br>

        Path:

        <strong>
            ${path.join(" → ")}
        </strong>

        <br><br>

        จำนวน Vertex:
        ${path.length}

    `;


    document.getElementById(
        "pathCount"
    ).textContent =
        path.length + " จุด";


    drawGraph(path);

}



/* ==========================================
   TREE
========================================== */

const treeData = {

    name: "TechStore",

    children: [

        {

            name: "CPU",

            children: [

                {

                    name: "AMD",

                    children: [

                        {
                            name:
                                "Ryzen 5 5600"
                        },

                        {
                            name:
                                "Ryzen 7 5700X"
                        }

                    ]

                },

                {

                    name: "Intel",

                    children: [

                        {
                            name:
                                "Core i5-13400F"
                        },

                        {
                            name:
                                "Core i7-13700"
                        }

                    ]

                }

            ]

        },


        {

            name: "VGA",

            children: [

                {

                    name: "NVIDIA",

                    children: [

                        {
                            name:
                                "RTX 3060"
                        },

                        {
                            name:
                                "RTX 4060"
                        }

                    ]

                },

                {

                    name: "AMD",

                    children: [

                        {
                            name:
                                "RX 7600"
                        }

                    ]

                }

            ]

        },


        {

            name: "RAM",

            children: [

                {

                    name: "DDR4",

                    children: [

                        {
                            name:
                                "Kingston Fury 16GB"
                        }

                    ]

                },

                {

                    name: "DDR5",

                    children: [

                        {
                            name:
                                "Corsair 16GB"
                        }

                    ]

                }

            ]

        },


        {

            name: "Storage",

            children: [

                {

                    name: "SSD",

                    children: [

                        {
                            name:
                                "Samsung 980 1TB"
                        }

                    ]

                },

                {

                    name: "HDD",

                    children: [

                        {
                            name:
                                "Seagate 2TB"
                        }

                    ]

                }

            ]

        }

    ]

};



/* ==========================================
   CREATE TREE
========================================== */

function createTree(node) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "tree-node";


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "tree-row";


    const hasChildren =
        node.children &&
        node.children.length > 0;


    const toggle =
        document.createElement(
            "button"
        );


    toggle.className =
        "tree-toggle";


    toggle.textContent =
        hasChildren
        ? "−"
        : "•";


    const label =
        document.createElement(
            "span"
        );


    label.className =
        "tree-label";


    if (
        node.name === "TechStore"
    ) {

        label.classList.add(
            "root"
        );

    }


    if (!hasChildren) {

        label.classList.add(
            "leaf"
        );

    }


    label.textContent =
        node.name;


    row.appendChild(toggle);

    row.appendChild(label);

    wrapper.appendChild(row);


    if (hasChildren) {

        const children =
            document.createElement(
                "div"
            );


        children.className =
            "tree-children";


        node.children.forEach(
            child => {

                children.appendChild(
                    createTree(child)
                );

            }
        );


        wrapper.appendChild(
            children
        );


        toggle.onclick =
            function () {

                children.hidden =
                    !children.hidden;


                toggle.textContent =
                    children.hidden
                    ? "+"
                    : "−";

            };

    } else {

        toggle.disabled =
            true;

    }


    return wrapper;

}



/* ==========================================
   GET LEAF PATHS
========================================== */

function getLeaves(
    node,
    currentPath = [],
    result = []
) {

    const path = [

        ...currentPath,

        node.name

    ];


    if (
        !node.children ||
        node.children.length === 0
    ) {

        result.push(path);

        return result;

    }


    node.children.forEach(
        child => {

            getLeaves(
                child,
                path,
                result
            );

        }
    );


    return result;

}



/* ==========================================
   INITIAL TREE PAGE
========================================== */

function initTreePage() {

    const tree =
        document.getElementById(
            "treeView"
        );


    if (tree) {

        tree.appendChild(
            createTree(treeData)
        );

    }


    const select =
        document.getElementById(
            "treeLeaf"
        );


    const paths =
        getLeaves(treeData);


    window.treePaths =
        paths;


    paths.forEach(
        (path, index) => {

            select.innerHTML += `

                <option value="${index}">

                    ${path[path.length - 1]}

                </option>

            `;

        }
    );


    showTreePath();

}



/* ==========================================
   SHOW TREE PATH
========================================== */

function showTreePath() {

    const select =
        document.getElementById(
            "treeLeaf"
        );


    const index =
        select.value;


    const path =
        window.treePaths[index];


    document.getElementById(
        "treePath"
    ).innerHTML =

        path.join(
            " → "
        );

}