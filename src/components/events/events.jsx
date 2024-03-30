import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ICU } from "../../utils/web3.js";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted pink",
    color: state.isSelected ? "red" : "blue",
    padding: 20,
  }),
  control: () => ({
    width: 200,
    position: "relative",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    const color = "white";
    return { ...provided, opacity, transition, color };
  },
};

const EventsList = () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const [levelPrice, setLevelPrice] = useState();
  const [userList, setUserList] = useState();

  const [users_autoPoolPayReceived, setUsersAutoPoolPayReceived] = useState();
  const [users_autopoolPayReciever, setUsersAutopoolPayReciever] = useState();
  const [users_batchPaid, setUsesBatchpaid] = useState();
  const [users_id, setUsersId] = useState();
  const [users_income, setUsersIncome] = useState();
  const [users_isExist, setUsersIsExist] = useState();
  const [users_levelIncomeReceived, setUsersLevelIncomeReceived] = useState();
  const [users_missedPoolPayment, setUsersMIssedPoolPayment] = useState();
  const [users_referredUsers, setUsersreffered] = useState();
  const [users_referrerID, setUsersReffereId] = useState();

  const [readData, setReadData] = useState({
    user_list: "",
    users: "",
    level_price: "",
  });

  const handleChangeRead = (event) => {
    let { name, value } = event.target;
    setReadData({ ...readData, [name]: value });
  };

  const handleSubmitUserList = async (event) => {
    event.preventDefault();
    let user_list_data = readData.user_list;
    user_list_data = parseInt(user_list_data);
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let userlist = await ICU_.methods.userList(user_list_data).call();
    setUserList(userlist);
  };

  const handleSubmitLevelPrice = async (event) => {
    event.preventDefault();

    let level_price_data = readData.level_price;
    level_price_data = parseInt(level_price_data);
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let level_income = await ICU_.methods.LEVEL_PRICE(level_price_data).call();
    const convert_income = web3.utils.fromWei(level_income, "ether");
    setLevelPrice(convert_income);
  };
  function roundToFour(num) {
    return +(Math.round(num + "e+4") + "e-4");
  }

  const handleSubmitUser = async (event) => {
    event.preventDefault();

    let users_ = readData.users;
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let userDetail = await ICU_.methods.users(users_).call();

    const income_ = web3.utils.fromWei(userDetail.income, "ether");

    setUsersAutoPoolPayReceived(userDetail.autoPoolPayReceived);
    setUsersAutopoolPayReciever(userDetail.autopoolPayReciever);
    setUsesBatchpaid(userDetail.batchPaid);
    setUsersId(userDetail.id);
    setUsersIncome(roundToFour(income_));
    setUsersIsExist(userDetail.isExist);
    setUsersLevelIncomeReceived(userDetail.levelIncomeReceived);
    setUsersMIssedPoolPayment(userDetail.missedPoolPayment);
    setUsersreffered(userDetail.referredUsers);
    setUsersReffereId(userDetail.referrerID);
  };

  return (
    <div className="custom-eventlist">
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Check Wallet by ID </h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <form
                      className="forms-sample w-100"
                      onSubmit={handleSubmitUserList}
                    >
                      <div className="form-group w-100 d-flex justify-content-between">
                        <input
                          className="form-control mt-2"
                          type="number"
                          required
                          name="user_list"
                          onChange={handleChangeRead}
                          value={readData.user_list}
                        />
                        <input
                          className="btn btn-primary mt-2"
                          type="submit"
                          value="Submit"
                        />
                      </div>
                    </form>
                  </div>
                  <h4 style={{ fontSize: "15px" }} className="mb-0">
                    {userList ? userList : 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Level Price</h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <form
                      className="forms-sample w-100"
                      onSubmit={handleSubmitLevelPrice}
                    >
                      <div className="form-group w-100   d-flex justify-content-between">
                        <input
                          className="form-control mt-2"
                          type="number"
                          required
                          name="level_price"
                          onChange={handleChangeRead}
                          value={readData.level_price}
                        />
                        <input
                          className="btn btn-primary mt-2"
                          type="submit"
                          value="Submit"
                        />
                      </div>
                    </form>
                  </div>
                  <h4 className="mb-0">{levelPrice ? levelPrice : 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User Details by wallet address</h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <form
                      className="forms-sample w-100"
                      onSubmit={handleSubmitUser}
                    >
                      <div className="form-group w-100   d-flex justify-content-between">
                        <input
                          className="form-control mt-2"
                          type="text"
                          required
                          name="users"
                          onChange={handleChangeRead}
                          value={readData.users}
                        />
                        <input
                          className="btn btn-primary mt-2"
                          type="submit"
                          value="Submit"
                        />
                      </div>
                    </form>
                  </div>

                  {users_autoPoolPayReceived ? (
                    <div className="user-detail-res">
                      <div className="d-flex">
                        <h4 className="heading_">
                          {" "}
                          Auto Pool Pay Received :-{" "}
                        </h4>
                        <h4> {users_autoPoolPayReceived}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_">
                          {" "}
                          Auto Pool Pay Receiver :-{" "}
                        </h4>
                        <h4> {users_autopoolPayReciever}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_">My User ID :- </h4>{" "}
                        <h4> {users_id}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Total Income :- </h4>
                        <h4> {users_income}</h4>
                      </div>

                      <div className="d-flex">
                        <h4 className="heading_"> Total Level Income :- </h4>
                        <h4> {users_levelIncomeReceived}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_">
                          {" "}
                          Missed Autopool Income :-{" "}
                        </h4>
                        <h4> {users_missedPoolPayment}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> Total Direct :- </h4>
                        <h4> {users_referredUsers}</h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="heading_"> My Sponsor :- </h4>
                        <h4> {users_referrerID}</h4>
                      </div>
                    </div>
                  ) : (
                    0
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;
