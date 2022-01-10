import React from 'react'
import AddTaskLamoda from './AddTaskLamoda'
export const sizes = ['4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5','13','13.5','14']
// import AddTaskShopify from './AddTaskShopify'
// import AddTaskSolebox from './AddTaskSolebox'
import './scss/tasks.global.scss'

const AddTask = () => {
    return (
        <div className="tab-pane fade" id="v-pills-addtasks" role="tabpanel" aria-labelledby="v-pills-addtasks-tab">
        <div className="container">
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
            <div className="carousel-inner mt-3">
                <div className="carousel-item active">
                    <AddTaskLamoda/>
                </div>
                <div className="carousel-item">
                    {/* <AddTaskLamoda/> */}
                </div>
                <div hidden /* className="carousel-item" */>
                <div className="container row">
                    <div className="container col-1" />
                    <div className="container col-10">
                    <form className="needs-validation" id="createTaskForm">
                        <div className="row g-6">
                        <h2 className="text-center ">Google forms</h2>
                        <div className="col">
                            <label htmlFor="formLink" className="form-label ">Link</label>
                            <input type="text" className="form-control" id="formLink" required />
                        </div>
                        </div>
                        {/* ВОЗМОЖНО ПРИГОДИТСЯ ДЛЯ ЭНДА */}
                        {/* <br>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" name="flexRadioDefault" id="MoreSettings" data-bs-toggle="collapse" href="#collapseMoreSettings" role="button" aria-expanded="false" aria-controls="collapseExample"data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                    <label class="form-check-label text-light" for="MoreSettings">
                                    Использовать дополнительные настройки
                                    </label>
                                </div>
                                <div class="collapse text-dark" id="collapseMoreSettings">
                                    <div class="card card-body">
                                    <input type="text" class="form-control" id="" required>
                                    </div>
                                </div> */}
                        <br />
                        <button className="btn btn-primary" id="newFormTaskButton">Начать</button>
                        <br />
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Начать
                        </button>
                        {/* Modal */}
                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Пояснение</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                Сечас высветится окно, где нужно будет заполнить форму. Далее бот сам все заполнит. Имя, фамилия и адреса будут джигаться максимальное количество раз.
                                <br />
                                <br />
                                После ручного заполнения статус будет показываться в тасках.
                            </div>
                            <div className="modal-footer">
                                <input className="form-check-input" type="checkbox" id="doNotShowAgainForm" />
                                <label className="form-check-label" htmlFor="doNotShowAgainForm">
                                Не показывать снова
                                </label>
                                <button type="button" className="btn btn-primary" id="newFormTaskButton">Начать</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </form>
                    </div>
                    <div className="container col-1" />
                </div>
                </div>
                {/* <div class="carousel-item">
                            <div class = 'container row'>
                            <div clas = 'container col-1'></div>
                            <div clas = 'container col-10'>
                                <h2 class = 'text-light text-center'>END raffles</h2>
                            </div>
                            <div clas = 'container col-1'></div>
                            </div>
                        </div> */}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
                <span className="visually-hidden">Предыдущий</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
                <span className="visually-hidden">Следующий</span>
            </button>
            </div>
            {/* <input type="button" class="btn btn-primary btn-lg btnSeccion" id="saveNewTaskButton" value="Сохранить"/> */}
            {/* </form> */}
        </div>
        </div>
    )
}
export default AddTask
