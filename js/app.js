var branch_row_size,
    branch_col_size, link_col_size

let C_tree_global,
    C_link_global,
    B_tree_global,
    B_link_global,
    ZB_0_YB_1

let ZB = [],
    EB = [],
    IB = [],
    YB = [],
    VB = [],
    JB = []

// Trigger modal
function triggerModal() {
    $('#basiceModal').modal('toggle')
}
var arr1 = math.matrix([
    [1, -0, -0],
    [1, 1, -0]
])
var arr2 = math.matrix([
    [1, 0],
    [1, 0]
])


function generateZBorYB(event) {
    if (ZB_0_YB_1 == 0)
        generateZB(event)
    else
        generateYB(event)
}

function generateEB_IB() {

    size = branch_col_size + link_col_size
    let html_EB = ''

    for (var i = 0; i < size; i++) {
        html_EB += `<tr><td><input type="text" name="EB" class="EB" size="3"></tr>`
    }
    let html_IB = ''

    for (var i = 0; i < size; i++) {
        html_IB += `<tr><td><input type="text" name="IB" class="IB" size="3"></tr>`
    }



    document.getElementById("EB-body").innerHTML = html_EB
    document.getElementById("IB-body").innerHTML = html_IB

    $('#EB_IB_modal').modal('toggle')

    setTimeout(() => {
        var height = document.querySelector("#EB-table").offsetHeight
        document.querySelector("#EB-text").style.lineHeight = height + "px"

        height = document.querySelector("#IB-table").offsetHeight
        document.querySelector("#IB-text").style.lineHeight = height + "px"
    }, 250)

}


function handleResult_with_ZB() {
    let B_total = math.concat(B_tree_global, B_link_global)

    let B_transpose = math.transpose(B_total)

    // ZB BT
    let ZB_B_transpose = math.multiply(ZB, B_transpose)

    // B ZB BT
    let B_ZB_B_transpose = math.multiply(B_total, ZB_B_transpose)


    // Get the result of the right part

    let B_EB = math.multiply(B_total, EB)


    let ZB_IB = math.multiply(ZB, IB)


    let B_ZB_IB = math.multiply(B_total, ZB_IB)

    let right = math.subtract(B_EB, B_ZB_IB)

    // IL
    let IL = math.multiply(math.inv(B_ZB_B_transpose), right)


    // RESULTS
    JB = math.multiply(B_transpose, IL)

    // Voltage
    let all_currents = math.add(JB, IB)

    let ZB_all_currents = math.multiply(ZB, all_currents)

    VB = math.subtract(ZB_all_currents, EB)

}

function handleResult_with_YB() {
    let C_total = math.concat(C_tree_global, C_link_global)

    let C_transpose = math.transpose(C_total)

    // YB CY
    let YB_C_transpose = math.multiply(YB, C_transpose)

    // C YB CY
    let C_YB_C_transpose = math.multiply(C_total, YB_C_transpose)


    // Get the result of the right part

    let C_IB = math.multiply(C_total, IB)


    let YB_EB = math.multiply(YB, EB)


    let C_YB_EB = math.multiply(C_total, YB_EB)

    let right = math.subtract(C_IB, C_YB_EB)

    // EN
    let EN = math.multiply(math.inv(C_YB_C_transpose), right)


    // RESULTS
    VB = math.multiply(C_transpose, EN)

    // Current
    let all_volts = math.add(VB, EB)

    let YB_all_volts = math.multiply(YB, all_volts)

    JB = math.subtract(YB_all_volts, IB)

}

function calculateResult(event) {

    console.log("In calculate result before handle")
    let noError = handleEB_IB()
    console.log("In calculate result after handle")

    if (!noError)
        return;

    console.log("before Hello")


    if (ZB_0_YB_1 == 0)
        handleResult_with_ZB()
    else {
        console.log("Helloooooooo")
        handleResult_with_YB()
    }
    // We will use the EB-IB Modal to put the result in
    size = branch_col_size + link_col_size
    let html_VB = ''

    for (var i = 0; i < size; i++) {
        html_VB += `<tr><td>${VB._data[i][0].toFixed(3)}</td></tr>`
    }
    let html_JB = ''

    for (var i = 0; i < size; i++) {
        html_JB += `<tr><td>${JB._data[i][0].toFixed(3)}</td></tr>`
    }



    document.getElementById("VB-body").innerHTML = html_VB
    document.getElementById("JB-body").innerHTML = html_JB

    $('#VB_JB_modal').modal('toggle')

    console.log("After Toggle")
    setTimeout(() => {
        var height = document.querySelector("#VB-table").offsetHeight
        document.querySelector("#VB-text").style.lineHeight = height + "px"

        height = document.querySelector("#JB-table").offsetHeight
        document.querySelector("#JB-text").style.lineHeight = height + "px"
    }, 250)



}

function handleEB_IB() {
    let error = false
    let arr_EB = []
    let arr_IB = []
    document.querySelectorAll(".EB").forEach((element) => {
        if (isNaN(parseInt(element.value))) {
            error = true
            Swal.fire({
                icon: 'error',
                text: 'You should Enter All EB Matrix Values as Numbers',
                confirmButtonText: 'Ok'
            })
            return error
        }
        arr_EB.push([parseInt(element.value)])
    })
    document.querySelectorAll(".IB").forEach((element) => {
        if (isNaN(parseInt(element.value))) {
            error = true
            return Swal.fire({
                icon: 'error',
                text: 'You should Enter All IB Matrix Values as Numbers',
                confirmButtonText: 'Ok'
            })
        }
        arr_IB.push([parseInt(element.value)])
    })

    EB = arr_EB // Global access
    IB = arr_IB // Global access

    if (error)
        return false
    else
        return true

}

function generateYB(e) {
    ZB_0_YB_1 = 1
        // Calculate B And C and put them in global variables
    var res = handleMatrixA(e)
    if (res != "yes")
        return;

    var size = branch_col_size + link_col_size
    e.preventDefault()
    let identity = math.identity(size)._data

    html = ''
    identity.forEach((arr) => {
        html += '<tr>'
        arr.forEach((number) => {
            if (number == 0)
                html += `<td><input type="text" size="3" disabled value="0"></td>`
            else
                html += `<td><input type="text" class="YB" size="3"></td>`

        })
        html += '</tr>'
    })

    document.getElementById("YB-body").innerHTML = html

    // document.querySelectorAll('.modal-dialog').forEach((modal) => {
    //     let widthOfTable = parseInt(document.querySelector("#ZB-body").scrollWidth)
    //     modal.style.maxWidth = (widthOfTable + 20).toString() + "px"
    //     console.log(widthOfTable)


    // })

    $('#YB_modal').modal('toggle')
    setTimeout(() => {
            let widthOfTable = document.querySelector("#YB-body").scrollWidth
            document.querySelector("#modal-YB").style.maxWidth = (widthOfTable + 60).toString() + "px"

        }, 250)
        // let widthOfTable = document.querySelector("#ZB-body").scrollWidth
        // document.querySelector("#modal-ZB").style.maxWidth = (widthOfTable + 20).toString() + "px"

    // console.log("widthOf Table ", widthOfTable)
}

function handleYB(e) {
    YB = []
    e.preventDefault()

    document.querySelectorAll(".YB").forEach((element) => {
        if (isNaN(parseInt(element.value))) {
            Swal.fire({
                icon: 'Error',
                text: 'Please Enter a Valid YB Matrix',
                confirmButtonText: 'Ok'
            })
            generateYB(e)
            return false
        }
        YB.push(parseInt(element.value))
    })
    YB = math.diag(YB)
    generateEB_IB()

    return true

}

function generateZB(e) {
    ZB_0_YB_1 = 0 // GLOBAL VAR to assure that we use ZB , Not YB
        // Calculate B And C and put them in global variables
    var res = handleMatrixA(e)
    if (res != "yes")
        return;

    var size = branch_col_size + link_col_size
    e.preventDefault()
    let identity = math.identity(size)._data

    html = ''
    identity.forEach((arr) => {
        html += '<tr>'
        arr.forEach((number) => {
            if (number == 0)
                html += `<td><input type="text" size="3" disabled value="0"></td>`
            else
                html += `<td><input type="text" class="ZB" size="3"></td>`

        })
        html += '</tr>'
    })

    document.getElementById("ZB-body").innerHTML = html

    // document.querySelectorAll('.modal-dialog').forEach((modal) => {
    //     let widthOfTable = parseInt(document.querySelector("#ZB-body").scrollWidth)
    //     modal.style.maxWidth = (widthOfTable + 20).toString() + "px"
    //     console.log(widthOfTable)


    // })

    $('#ZB_modal').modal('toggle')
    setTimeout(() => {
            let widthOfTable = document.querySelector("#ZB-body").scrollWidth
            document.querySelector("#modal-ZB").style.maxWidth = (widthOfTable + 60).toString() + "px"

        }, 250)
        // let widthOfTable = document.querySelector("#ZB-body").scrollWidth
        // document.querySelector("#modal-ZB").style.maxWidth = (widthOfTable + 20).toString() + "px"

    // console.log("widthOf Table ", widthOfTable)
}


function handleZB(e) {
    ZB = []
    e.preventDefault()

    document.querySelectorAll(".ZB").forEach((element) => {
        if (isNaN(parseInt(element.value))) {
            Swal.fire({
                icon: 'Error',
                text: 'Please Enter a Valid ZB Matrix',
                confirmButtonText: 'Ok'
            })
            generateZB(e)
            return false
        }
        ZB.push(parseInt(element.value))
    })
    ZB = math.diag(ZB)
    generateEB_IB()

    return true
}



function generateMatrix(e) {
    e.preventDefault()
    branch_row_size = parseInt(document.querySelector('#branch-row-size').value)
    branch_col_size = parseInt(document.querySelector('#branch-col-size').value)
    link_col_size = parseInt(document.querySelector('#link-col-size').value)

    if (branch_row_size < 1 || isNaN(branch_row_size) || branch_col_size < 1 || isNaN(branch_col_size) || link_col_size < 1 || isNaN(link_col_size))
        return;

    let code = ''

    for (var i = 0; i < branch_row_size; i++) {
        code += '<tr>'

        // Iterate Branch cells
        code += '<td class="branch">'
        for (var j = 0; j < branch_col_size; j++) {
            code += `<input type="text" name="field${i}${j}" size="3">`
        }
        code += '</td>'

        // Iterate Link cells
        code += '<td class="link">'
        for (var j = 0; j < link_col_size; j++) {
            code += `<input type="text" name="field${i}${j}" size="3">`
        }
        code += '</td>'


        code += '</tr>'
    }
    document.getElementById("matrix").innerHTML = code


    document.getElementById("inputField").style.display = "block"
}



// Calculate B And C Matrix
function handleMatrixA(e, type_of_operation = "") {
    branch_col_size = parseInt(document.querySelector('#branch-col-size').value)
    link_col_size = parseInt(document.querySelector('#link-col-size').value)
    e.preventDefault();

    try {
        // Generate matrix From Inputs
        const {
            branchMatrix,
            linkMatrix
        } = generateMatrixFromForm()

        const {
            C_branch,
            C_link
        } = calculateMatrixC(branchMatrix, linkMatrix, branch_col_size)


        C_tree_global = C_branch
        C_link_global = C_link
        if (type_of_operation == "calc_C") {
            return printMatrix(C_branch, C_link, "C matrix")
        }

        const {
            B_tree,
            B_link
        } = calculateMatrixB(C_link, link_col_size)
        B_tree_global = B_tree
        B_link_global = B_link
        if (type_of_operation == "calc_B") {
            return printMatrix(B_tree, B_link, "B matrix")
        }


        return "yes" // Means reached without Errors
    } catch (err) {
        return Swal.fire({
            icon: 'error',
            text: 'Please Enter a Valid Matrix',
            confirmButtonText: 'Ok'
        })
    }
    //const ZB_B_Transpose = math.multiply(ZB, linkMatrix)
}

function calculateMatrixC(branchMatrix, linkMatrix, A_branch_col_size) {
    const A_tree_inverse = math.inv(branchMatrix)

    const C_link = math.multiply(A_tree_inverse, linkMatrix)

    const C_branch = math.identity(A_branch_col_size, A_branch_col_size)

    return {
        C_branch,
        C_link
    }
}

function calculateMatrixB(C_link, link_col_size) {
    const B_branch = math.dotMultiply(math.transpose(C_link), -1)

    // Get B_link
    const size = link_col_size
    const B_link = math.identity(size, size)


    return {
        B_tree: B_branch,
        B_link
    }
}

function printMatrix(tree, link, h2) {
    var all_matrix = math.concat(tree, link)._data
    var body = document.getElementById("result-body")
    html = ''
    all_matrix.forEach((arr) => {
        html += '<tr>'
        arr.forEach((number) => {
            html += `<td>${number}</td>`
        })
        html += '</tr>'
    })
    body.innerHTML = html

    document.getElementById("result-h5").innerHTML = h2

    triggerModal()
}

function generateMatrixFromForm() {
    var branch_row_size = parseInt(document.querySelector('#branch-row-size').value)
    var branch_col_size = parseInt(document.querySelector('#branch-col-size').value)
    var link_col_size = parseInt(document.querySelector('#link-col-size').value)

    let branchMatrix = []
    let linkMatrix = []

    let branches = document.querySelectorAll(".branch input")
    let links = document.querySelectorAll(".link input")

    // Generate branch Arr
    let temp = branch_col_size
    let temp_arr = []
    for (var i = 0; i < branches.length; i++) {
        if (i % temp == 0 && i != 0) {
            branchMatrix.push(temp_arr)
            temp_arr = []
        }
        let value = parseInt(branches[i].value)
            // If Any value is Empty
        if (isNaN(value))
            return Swal.fire({
                icon: 'error',
                text: 'You should Enter All the Matrix Values as Numbers',
                confirmButtonText: 'Ok'
            })
        temp_arr.push(value)
    }
    branchMatrix.push(temp_arr)

    // Generate Link Array
    temp = link_col_size
    temp_arr = []
    for (var i = 0; i < links.length; i++) {
        if (i % temp == 0 && i != 0) {
            linkMatrix.push(temp_arr)
            temp_arr = []
        }
        let value = parseInt(links[i].value)
        temp_arr.push(value)
    }
    linkMatrix.push(temp_arr)


    return {
        branchMatrix,
        linkMatrix
    }

}