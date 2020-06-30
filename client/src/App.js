import React, { Component } from "react";
import SimpleWallet from "./contracts/SimpleWallet.json";
import Allownce from "./contracts/Allownce.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = {loaded:false, address:"0xd57092809ad05791dee231224d79a42702d7b907",
   amount:100000, reduceAddress: "0xd57092809ad05791dee231224d79a42702d7b907",
  sendAmount:10000, withdrawAddress:"0xd57092809ad05791dee231224d79a42702d7b907",
  allownceAddress:"0xd57092809ad05791dee231224d79a42702d7b907"};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();

      this.simpleWalletInstance = new this.web3.eth.Contract(
        SimpleWallet.abi,
        SimpleWallet.networks[networkId].address,
      );
      this.allownceInstance = new this.web3.eth.Contract(
        Allownce.abi,
        SimpleWallet.networks[networkId].address,
      )

      console.log(this.accounts);


     

      console.log(SimpleWallet.networks[networkId].address);
    
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({loaded:true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  handleInputChange = (event) =>{
    const target = event.target;
    const value = target.value ==="checkbox"? target.checked : target.value
    const name = target.name;
    this.setState({
      [name] : value
    })
  }
  //to allow address for some money
  allowAdresses = () => {
    const {address, amount} = this.state;
   // determineAllownce(address, amount).send({from:this.accounts[0]}).
    
    this.simpleWalletInstance.methods.determineAllownce(address, amount).send({from:this.accounts[0]})
    .then(result => {
      console.log(this.accounts[0]);

      this.simpleWalletInstance.methods.allownce(address).call().then(console.log).catch(console.error);
      
    }).catch(console.error);  
  }
  //get The value which can send as a allownce Address
  getValueAllwonce = () => {
    const {allownceAddress} = this.state;
    this.simpleWalletInstance.methods.allownce(allownceAddress).call().then(result => {
      alert("the address => " + allownceAddress + "the value in wei Can send => " + result);
    })
  }
  //to withdraw Money to anouther address
  withdrawHandle = () => {
    const {withdrawAddress, sendAmount} = this.state;
    
    this.simpleWalletInstance.methods.owner().call().then(theOwner => {
      console.log("the owner" + theOwner);
      this.simpleWalletInstance.methods.withdrawMoney(withdrawAddress, sendAmount)
    .send({from:this.accounts[0]})
    .then(result => {
      alert("the transaction is confirmd");
      
      alert("from => " + result.events.sendMoney.returnValues.from + 
            "to => " + result.events.sendMoney.returnValues._to + 
            "the amount => " + result.events.sendMoney.returnValues._amount); 

      this.simpleWalletInstance.methods.myBalance().call().then(console.log);

    }).catch(error => {
      console.log(error);
    });
    }).catch(error => {
      console.log("the error from the owner");
      console.error(error);
    })
    
     
  }
  //destroy the allownce address and make it zero
  reduceAddresses = () => {
    const {reduceAddress} = this.state;

    this.simpleWalletInstance.methods.reduceAllownceToZero(reduceAddress).send({from:this.accounts[0]}).then(result => {
      console.log(result.events.allownceChange);
      const theAddress = result.events.allownceChange.returnValues._who;
      const _oldAmount = result.events.allownceChange.returnValues._oldAmount;
      const _newAmount = result.events.allownceChange.returnValues._newAmount;
   

      alert("the address =>" + theAddress + "the old Amount =>" + _oldAmount + "the new Amount =>" + _newAmount);
      }
    ).catch(console.error);
  }
  //to getBalance from the contract
  getBalanceHandle = () => {
    this.simpleWalletInstance.methods.myBalance().call().then(result => {
      alert("the balance in The Address => " + result);
    })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>TestWalletEthereum</h1>

        <div className="chooseAllonce">
          <h2>make allownce</h2>
        thePerson allowe: <input type = "text" name="address" value={this.state.address} 
        onChange={this.handleInputChange}/>
        allowe ethereum: <input type="text" name="amount" value={this.state.amount} 
        onChange={this.handleInputChange}/> 
        <button type="button" onClick={this.allowAdresses}>chooseAllownce</button>
        </div>

        <div className="getAllownceValue">
          <h2>get Allownce value</h2>
         theAddress: <input type="text" name="allownceAddress" value={this.state.allownceAddress}
          onChange={this.handleInputChange}/>
          <button type="button" onClick={this.getValueAllwonce}>getAllownceValue</button>
        </div>

        <div className="withdrawMoney" >
          <h2>withdrawMoney</h2>
          toAddress:<input type="text" name="withdrawAddress" value={this.state.withdrawAddress} onChange={this.handleInputChange}/>
          theAmount:<input type="text" name="sendAmount" value={this.state.sendAmount}  onChange={this.handleInputChange}/>
          <button type="button" onClick={this.withdrawHandle}>withdrawMoney</button>
        </div>
        

        <div className="reduceToZero">
          <h3>destroyAllownce</h3>
          reduceAddress : <input type="text" name="reduceAddress" value={this.state.reduceAddress} 
          onChange={this.handleInputChange}/>
          <button type="button" onClick={this.reduceAddresses}>reduceAddress</button>
        </div>

        <div className="getBalance">
          <button type="button" onClick={this.getBalanceHandle}>getBalance</button>
        </div>
        
      </div>
    );
  }
}

export default App;
