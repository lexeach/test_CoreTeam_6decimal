import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import Web3 from "web3";
import { ICU, BEP20, USDT, EXAM, FootPrint, ClaimLXC } from "../../utils/web3.js";
const Dashboard = () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const [account, setAccount] = useState();
  const [frznBalance, setFrznBalance] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [networkStatus, setnetworkStatus] = useState(false);
  const [gasSatus, setgasSatus] = useState(false);
  const [balanceStatus, setbalanceStatus] = useState(false);

  const [claimAvailable, setClaimAvailable] = useState();
  const [claimTaken, setClaimTaken] = useState();
  const [eligibleClaimPercentage, setEligibleClaimPercentage] = useState();
  const [partnerID, setPartnerID] = useState();
  const [total_rbcd, setTotal_rbcd] = useState();
  const [referrerID, setReferrerID] = useState({ id: "" });
  const [userAc, setUserAc] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coreID, setCoreID] = useState();
  const [coreReferrerID, setCoreReferrerID] = useState();
  const [coreReferredUsers, setCoreReferredUsers] = useState();
  const [coreIncome, setCoreIncome] = useState();
  const [coreTokenPrice, setCoreTokenPrice] = useState();
  const [coreReceivedToken, setCoreReceivedToken] = useState();
  const [coreRegTime, setCoreRegTime] = useState();
  const [eligibleCorePercentage, setEligibleCorePercentage] = useState();

  const [total_rbcdClaim, setTotal_rbcdClaim] = useState();
  const [claimAvailableClaim, setClaimAvailableClaim] = useState();
  const [claimTakenClaim, setClaimTakenClaim] = useState();
  const [coreUserExist, setCoreUserExist] = useState();
  //////////////////////////////////
  const location = useLocation().search;
  // const abcref = new URLSearchParams(location).get("abcref");
  // const refid = new URLSearchParams(location).get("refid");

  // useEffect(() => {
  //   if (abcref === "123xyz") {
  //     if (refid !== 0) {
  //       setReferrerID({ ...referrerID, id: refid });
  //     }
  //   }
  // }, []);
  //////////////////////////////////
  const [udId, setUdId] = useState();
  const [udIsExist, setUdIsExist] = useState();
  const [exSubAdmin, setExSubAdmin] = useState();
  // user Details
  useEffect(() => {
    async function user_detail() {
      const account = await web3.eth.requestAccounts();

      let EXAM_CONTREC = new web3.eth.Contract(EXAM.ABI, EXAM.address);
      let subAdmin = await EXAM_CONTREC.methods.isPass(account[0]).call();
      setExSubAdmin(subAdmin);
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let userDetail = await ICU_.methods.users(account[0]).call();
      let { id, isExist } = userDetail;
      setUdId(id);
      setUdIsExist(isExist);
      let claimAvailable = await ICU_.methods.claimAvailable(account[0]).call();
      claimAvailable = web3.utils.fromWei(claimAvailable, "ether");
      setClaimAvailable(roundToFour(claimAvailable));
      let claimTaken = await ICU_.methods.claimTaken(account[0]).call();
      claimTaken = web3.utils.fromWei(claimTaken, "ether");
      setClaimTaken(roundToFour(claimTaken));
      let elibleClaim = await ICU_.methods
        .eligibleClaimPercentage(account[0])
        .call();
      setEligibleClaimPercentage(Number(elibleClaim / 100).toFixed(2));
      let partnerId = await ICU_.methods.partnerID(account[0]).call();
      setPartnerID(partnerId);
      let total_rbcd = await ICU_.methods.total_rbcd().call();
      total_rbcd = web3.utils.fromWei(total_rbcd, "ether");
      setTotal_rbcd(roundToFour(total_rbcd));
      let coreusers = await ICU_.methods.coreusers(account[0]).call();
      setCoreUserExist(coreusers.isExist);
      setCoreID(coreusers.coreID);
      setCoreReferrerID(coreusers.referrerID);
      setCoreReferredUsers(coreusers.referredUsers);
      setCoreIncome(
        Number(await web3.utils.fromWei(coreusers.income, "ether")).toFixed(4)
      );
      setCoreTokenPrice(
        Number(await web3.utils.fromWei(coreusers.tokenPrice, "ether")).toFixed(
          6
        )
      );
      setCoreReceivedToken(
        Number(
          await web3.utils.fromWei(coreusers.receivedToken, "ether")
        ).toFixed(4)
      );
      setCoreRegTime(await epochToDate(coreusers.regTime));
      let eligibleCorePercentages = await ICU_.methods
        .eligibleCorePercentage(account[0])
        .call();
      setEligibleCorePercentage(
        Number(eligibleCorePercentages / 100).toFixed(2)
      );
      let ClaimCon = new web3.eth.Contract(ClaimLXC.ABI, ClaimLXC.address);
      let FootPrnt = new web3.eth.Contract(FootPrint.ABI, FootPrint.address);
      let totalRbcdClaim = await FootPrnt.methods.totalRBCD().call();
      setTotal_rbcdClaim(
        Number(await web3.utils.fromWei(totalRbcdClaim, "ether")).toFixed(4)
      );

      let claimTakenC = await ClaimCon.methods.claimTaken(account[0]).call();

      setClaimTakenClaim(
        Number(await web3.utils.fromWei(claimTakenC, "ether")).toFixed(4)
      );
      let sumofall =
        (Number(totalRbcdClaim) *
          (Number(elibleClaim) +
          Number(eligibleCorePercentages))) /
        10000 - claimTakenC;
      sumofall = sumofall.toString();

      setClaimAvailableClaim(
        Number(await web3.utils.fromWei(sumofall, "ether")).toFixed(4)
      );
    }
    user_detail();
  }, []);
  async function epochToDate(epochTime) {
    if (epochTime == undefined || Number(epochTime) <= 0) {
      return "00/00/0000";
    }
    const milliseconds = epochTime * 1000;
    console.log("millisecond:", milliseconds);
    // Create a new Date object
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  //////////////////////////////////
  function roundToFour(num) {
    return +(Math.round(num + "e+4") + "e-4");
  }
  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      if (!accounts) {
        alert("please install metamask");
      }
      let balance = await web3.eth.getBalance(accounts[0]);
      const etherValue = web3.utils.fromWei(balance, "ether");
      const networkId = await web3.eth.net.getId();
      let Usdt = new web3.eth.Contract(USDT.ABI, USDT.address);
      const bal = await Usdt.methods.balanceOf(accounts[0]).call();
      const usdtbal = bal / 10 ** 18;
      if (150 <= usdtbal) {
        setbalanceStatus(true);
      }
      if (networkId === 97) {
        setnetworkStatus(true);
      }
      if (0.002 <= parseFloat(etherValue)) {
        setgasSatus(true);
      }
      setAccount(accounts[0]);
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);

      let frozenBalance = await BEP20_.methods
        ._frozenBalance(accounts[0])
        .call();
      const frozenBalance_convert = web3.utils.fromWei(frozenBalance, "ether");
      setFrznBalance(roundToFour(frozenBalance_convert));
      let token_balance = await BEP20_.methods.balanceOf(accounts[0]).call();
      const convert_tokenBal = web3.utils.fromWei(token_balance, "ether");
      setTokenBalance(roundToFour(convert_tokenBal));
    }

    function roundToFour(num) {
      return +(Math.round(num + "e+4") + "e-4");
    }
    load();
  }, []);

  const importTokenToMetaMask = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      console.log("MetaMask is not installed");
      return;
    }

    try {
      const result = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: "0x487C09FfecD0525e3D86E55deF2417542cFBDcC6",
            symbol: "LXC",
            decimals: 18,
            image:
              "https://main.dzpg12buw8l5c.amplifyapp.com/static/media/logo.43931fe53d4b9d4bf938.png",
          },
        },
      });

      if (result) {
        // console.log(`Successfully imported ${tokenSymbol} to MetaMask`);
      } else {
        console.log("Token import was canceled by the user");
      }
    } catch (error) {
      console.log("Error importing token to MetaMask:", error);
    }
  };

  const switchToCustomChain = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      console.log("MetaMask is not installed");
      return;
    }

    const chainParams = {
      chainId: "0x61",
      chainName: "Binance Smart Chain Testnet",
      nativeCurrency: {
        name: "tBNB",
        symbol: "tBNB",
        decimals: 18,
      },
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
      blockExplorerUrls: ["https://testnet.bscscan.com/"],
    };

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [chainParams],
      });
    } catch (error) {
      console.log("Error switching to custom chain:", error);
    }
  };

  const handleSubmit = async (event) => {
    if (!networkStatus) {
      return alert("please connect to binance testnet network");
    }
    if (!gasSatus) {
      return alert("insufficient gas fee");
    }
    if (!balanceStatus) {
      return alert("insufficient usdt fund");
    }

    event.preventDefault();
    let { id } = referrerID;
    let coRefId;

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let value_ = await ICU_.methods.REGESTRATION_FESS().call();
    let EXAM_CONTREC = new web3.eth.Contract(EXAM.ABI, EXAM.address);

    let REGESTRATION_FESS = await ICU_.methods.REGESTRATION_FESS().call();
    let ref_user_acc = await ICU_.methods.userList(id).call();
    let ref_user_detail = await ICU_.methods.users(ref_user_acc).call();
    const { referredUsers, coreferrerID } = ref_user_detail;

    let subAdmin = await EXAM_CONTREC.methods.isPass(ref_user_acc).call();
    if (subAdmin && parseInt(referredUsers) > 2) {
      coRefId = id;
    } else {
      coRefId = coreferrerID;
    }

    if (REGESTRATION_FESS === "150000000000000000000") {
      let USDT_ = new web3.eth.Contract(USDT.ABI, USDT.address);
      let isApprove, reg_user;
      isApprove = await USDT_.methods
        .approve(ICU.address, value_)
        .send({ from: account })
        .on("receipt", function (receipt) {
          console.log("recept: ", receipt);
        })
        .on("error", console.error);
      reg_user = await ICU_.methods
        .regCoreMember(value_)
        .send({ from: account, value: 0 })
        .on("error", (err) => {
          console.log("the error in reg", err);
        });
      if (reg_user.status) {
        alert("Registerd Success");
      } else {
        alert("Registerd Failed !!!!");
      }
    } else {
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let approve = await BEP20_.methods
        .approve(ICU.address, value_)
        .send({ from: account });
      console.log("the approve response", approve);
      console.log("the value out of status", value_);
      if (approve.status === true) {
        let reg_user = await ICU_.methods
          .regUser(id, coRefId, value_)
          .send({ from: account, value: 0 })
          .on("error", (err) => {
            console.log("the error in reg", err);
          });
        if (reg_user.status) {
          alert("Registerd Success");
        } else {
          alert("Registerd Failed !!!!");
        }
      }
    }
  };

  async function userAccount() {
    const accounts = await web3.eth.requestAccounts();
    if (!accounts) {
      alert("please install metamask");
    }
    setUserAc(accounts[0]);
  }
  useEffect(() => {
    userAccount();
  }, []);
  const claimTokens = async () => {
    // event.preventDefault();
    try {
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      console.log("accoutn", account);
      await ICU_.methods.takeClaim().send({ from: account });
    } catch (e) {}
  };

  async function scientificToInteger(scientificNotation) {
    const [coefficient, exponent] = scientificNotation.split("e");
    const decimalValue = parseFloat(coefficient);
    const integerPart = Math.floor(decimalValue);
    const fractionalPart = decimalValue - integerPart;
    let stringValue = integerPart.toString();
    const splitArray = scientificNotation.split("e+");
    const decimalPlaces = splitArray[1];
    stringValue += fractionalPart.toFixed(decimalPlaces).slice(2);
    console.log("String Value: ", stringValue);
    return stringValue;
  }

  const regCoreMember = async () => {
    try {
      setLoading(true);
      console.log("Loading set true: ", loading);
      const accounts = await web3.eth.requestAccounts();
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      console.log("accoutn", account);
     let value_ = await ICU_.methods.REGESTRATION_FESS().call();
      let tax = await ICU_.methods.taxRate().call();

     // Apply tax rate to value_
      value_ = (Number(value_) + (Number(value_) * Number(tax) / 100)).toString();

     // Multiply the result by 10
      value_ = Math.ceil((Number(value_) * 10)).toString();
      
     // Convert to integer using scientificToInteger function
     value_ = await scientificToInteger(value_);
      let USDT_ = new web3.eth.Contract(USDT.ABI, USDT.address);
      await USDT_.methods
        .approve(ICU.address, value_)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          setLoading(false);
        })
        .on("error", function (error) {
          setLoading(false);
          console.log(error);
        });

      await ICU_.methods
        .regCoreMember(value_)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          setLoading(false);
          console.log("Receipt,receipt");
          alert("You have successfully Register Core Member");
        });
    } catch (e) {
      console.log("In catch block of reg core member: ", e);
      alert("Register Core Member Failed");
      setLoading(false);
    }
  };
  const takeClaimCon = async () => {
    try {
      let TakeCl = new web3.eth.Contract(ClaimLXC.ABI, ClaimLXC.address);
      await TakeCl.methods.takeClaim().send({ from: account });
    } catch (e) {}
  };
  return (
    <div className="home-container container">
      <div className="row public-section-bg">
        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body text-center">Public Value</div>
          </div>
        </div>
        {/* Is Exist  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Is Exist</h6>
              <h4 className="mb-0">{udIsExist ? "YES" : "NO"}</h4>
            </div>
          </div>
        </div>
        {/* sub admin  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Sub Admin </h6>
              <h4 className="mb-0">{exSubAdmin ? "YES" : "NO"}</h4>
            </div>
          </div>
        </div>
        {/* stage income */}
        <div
          className="col-lg-3 col-md-6 col-sm-12 grid-margin"
          onClick={() => {
            importTokenToMetaMask();
          }}
        >
          <div className="card">
            <div className="click-btn">
              <h6>Click To</h6>
              <h2 className="mb-0">Add Token</h2>
            </div>
          </div>
        </div>
        <div
          className="col-lg-3 col-md-6 col-sm-12 grid-margin"
          onClick={() => {
            switchToCustomChain();
          }}
        >
          <div className="card">
            <div className=" click-btn">
              <h6>Click To Change</h6>
              <h2 className="mb-0"> Network</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Frozen Balance </h6>
              <h4 className="mb-0">{frznBalance ? frznBalance : 0} LXC</h4>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Token Balance</h6>
              <h4 className="mb-0">{tokenBalance ? tokenBalance : 0} LXC</h4>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Claim AVailable</h6>
              <h4 className="mb-0">
                {claimAvailable ? claimAvailable : 0} LXC
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Claim Token</h6>
              <h4 className="mb-0">{claimTaken ? claimTaken : 0} LXC</h4>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Eligible Claim Percentage</h6>
              <h4 className="mb-0">
                {eligibleClaimPercentage ? eligibleClaimPercentage : 0} %
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Partner ID</h6>
              <h4 className="mb-0">{partnerID ? partnerID : 0} </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>User ID</h6>
              <h4 className="mb-0">{udId ? udId : 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Total RBCD</h6>
              <h4 className="mb-0">{total_rbcd ? total_rbcd : 0} LXC</h4>
            </div>
          </div>
        </div>
        {coreUserExist && (
          <>
            <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
              <div className="card-sp">
                <div className="card-body">
                  <h6>Core ID</h6>
                  <h4 className="mb-0">{coreID ? coreID : 0} </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
              <div className="card-sp">
                <div className="card-body">
                  <h6>Core Referrer ID</h6>
                  <h4 className="mb-0">
                    {coreReferrerID ? coreReferrerID : 0}{" "}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
              <div className="card-sp">
                <div className="card-body">
                  <h6>Core Referred Users</h6>
                  <h4 className="mb-0">
                    {coreReferredUsers ? coreReferredUsers : 0}{" "}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
              <div className="card-sp">
                <div className="card-body">
                  <h6>Core Income</h6>
                  <h4 className="mb-0">{coreIncome ? coreIncome : 0} LXC</h4>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
              <div className="card-sp">
                <div className="card-body">
                  <h6>Core Token Price</h6>
                  <h4 className="mb-0">
                    {coreTokenPrice ? coreTokenPrice : 0} USDT
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
              <div className="card-sp">
                <div className="card-body">
                  <h6>Core Received Token</h6>
                  <h4 className="mb-0">
                    {coreReceivedToken ? coreReceivedToken : 0} LXC
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
              <div className="card-sp">
                <div className="card-body">
                  <h6>Core Reg Time</h6>
                  <h4 className="mb-0">{coreRegTime ? coreRegTime : 0} </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
              <div className="card-sp">
                <div className="card-body">
                  <h6>Eligible Core Percentage</h6>
                  <h4 className="mb-0">
                    {eligibleCorePercentage ? eligibleCorePercentage : 0} %{" "}
                  </h4>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="row public-section-claim">
        {/* ////// */}
        {/* public value  */}
        {/* ////// */}
        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body text-center">Claim Contract</div>
          </div>
        </div>
        {/* Is Exist  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Total RBCD </h6>
              <h4 className="mb-0">{total_rbcdClaim ? total_rbcdClaim : 0}</h4>
            </div>
          </div>
        </div>
        {/* sub admin  */}

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Claim Available </h6>
              <h4 className="mb-0">
                {claimAvailableClaim ? claimAvailableClaim : 0} LXC
              </h4>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>TakeClaim </h6>
              <h4 className="mb-0">
                {claimTakenClaim ? claimTakenClaim : 0} LXC
              </h4>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Claim Taken </h6>
              <button onClick={takeClaimCon}>Take Calim</button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-12 grid-margin">
        <div className="card">
          <div className="card-body text-center">Write Function</div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-6 grid-margin">
          <div className="card">
            <div className="card-body">
              <h6>Take Claim</h6>
              <button onClick={claimTokens}>Claim</button>
            </div>
          </div>
        </div>
        {!coreUserExist && (
          <div className="col-lg-6 col-md-6 col-sm-6 grid-margin">
            <div className="card">
              <div className="card-body">
                <h6>Reg Core Member</h6>

                {loading && (
                  <div className="loader-overlay">
                    {" "}
                    Transaction is Approving{" "}
                  </div>
                )}
                <button onClick={regCoreMember}>Reg Core Member</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
