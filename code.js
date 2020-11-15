document.onreadystatechange = async function() {
    let login = await axios({
        method:'post',
        url: `http://localhost:3030/login`,
        withCredentials: true,
        data: {
            user: "tyler",
            password: "112334",
        }
    })

    let res = await axios({
        method:'get',
        url: `http://localhost:3030/meeting/0`,
        withCredentials: true
    })

    let div = document.createElement("div");
    let root = document.querySelector("#root");

    div.innerHTML = res.data.className;
    root.appendChild(div);
}