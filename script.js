const form = document.getElementById("dormForm");
const result = document.getElementById("result");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const studentId = document.getElementById("studentId").value;
    const buildingNumber = document.getElementById("buildingNumber").value;
    const roomNumber = document.getElementById("roomNumber").value;

    const errors = [];

    try {
        const studentResponse = await fetch(
            `https://inai-col1.fishrungames.com/students/${studentId}`
        );

        if (!studentResponse.ok) {
            errors.push("Студент с таким ID не найден.");
        } else {
            const student = await studentResponse.json();

            if (student.resident !== true) {
                errors.push("Студент не является иногородним.");
            }
        }


        const buildingResponse = await fetch(
            `https://inai-col1.fishrungames.com/buildings/${buildingNumber}`
        );

        if (!buildingResponse.ok) {
            errors.push("Корпус с таким номером не найден.");
        } else {
            const building = await buildingResponse.json();

            if (building.forStudents !== true) {
                errors.push("Корпус не предназначен для студентов.");
            }
        }


        const roomResponse = await fetch(
            `https://inai-col1.fishrungames.com/rooms/${roomNumber}`
        );

        if (!roomResponse.ok) {
            errors.push("Комната с таким номером не найдена.");
        } else {
            const room = await roomResponse.json();

            if (room.available !== true) {
                errors.push("Комната уже занята.");
            }
        }


        if (errors.length === 0) {
            result.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <h4 class="alert-heading">
                        Заявка одобрена
                    </h4>

                    <p>
                        Все условия выполнены.
                    </p>

                    <hr>

                    <p class="mb-0">
                        Студент может заселиться
                        в корпус №${buildingNumber},
                        комнату №${roomNumber}.
                    </p>
                </div>
            `;
        } else {
            result.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">
                        В заселении отказано
                    </h4>

                    <hr>

                    <ul class="mb-0">
                        ${errors.map(error => `<li>${error}</li>`).join("")}
                    </ul>
                </div>
            `;
        }

    } catch (error) {
        result.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Не удалось подключиться к серверу.
            </div>
        `;
    }
});