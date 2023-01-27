const listItems = document.querySelectorAll(".opciones-menu li")

listItems.forEach(item => {
    item.addEventListener("click", () => {
        let isActive = item.classList.contains("active");

        listItems.forEach(el => {
            el.classList.remove("active");
        })

        if (isActive) item.classList.remove("active");
        else item.classList.add("active");
    });
});