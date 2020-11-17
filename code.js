document.onreadystatechange = async function() {
    let login = await axios({
        method:'post',
        url: `https://stark-depths-67325.herokuapp.com/login`,
        withCredentials: true,
        data: {
            user: "tyler",
            password: "112334",
        }
    })

    console.log(login);

    let res = await axios({
        method:'get',
        url: `https://stark-depths-67325.herokuapp.com/meeting/0`,
        withCredentials: true
    })

    let div = document.createElement("div");
    let root = document.querySelector("#root");

    div.innerHTML = res.data.className;
    root.appendChild(div);
}