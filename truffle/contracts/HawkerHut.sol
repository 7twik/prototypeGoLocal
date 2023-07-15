// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HawkerHut {
  struct details {
    address payable customer;
    address payable hawker;
    uint256 cus_amount;
    uint256 hawker_amount;
  }
  event success(string message, bool result, uint256 amount);
  mapping(string => details) hawkerStalls;

  //Customer side-> approve function (where customer address is noted and customer pays)
  function pay(string memory id) public payable {
    if (msg.value >= 0.1 ether) {
      
      hawkerStalls[id].customer = payable(msg.sender);
      hawkerStalls[id].hawker = payable(msg.sender);
      hawkerStalls[id].cus_amount = msg.value;
      hawkerStalls[id].hawker_amount = 0;
        emit success("Payment successful", true, msg.value);
    } else {
      payable(msg.sender).transfer(msg.value);
      emit success("You need to pay more than 0.1ether", false,0);
    }
  }

  //Hawker side-> accept function (where hawker address is noted)
  function hawkerId(string memory id) public {
    hawkerStalls[id].hawker = payable(msg.sender);
    emit success("Hawker id noted", true,0);
  }

  //Customer side-> cancel function (where customer can cancel the payment and withdraw the money)
  function cancelPayment(string memory id) public {
    if ((hawkerStalls[id].customer == msg.sender)||(hawkerStalls[id].hawker == msg.sender)) {
      if (hawkerStalls[id].cus_amount > 0) {
      
        uint256 amounte = hawkerStalls[id].cus_amount;
        hawkerStalls[id].cus_amount = 0;
        payable(msg.sender).transfer(amounte);
        emit success("Payment cancellation successful", true, amounte);
      } else {
        emit success("You have no money to withdraw", false,0);
      }
    } else {
      emit success("You are not the customer", false,0);
    }
  }

  //Customer side-> partial payment function
  //(where customer can assign half the amount to hawker and withdraw rest)
  function partialPayment(string memory id) public {
    if (hawkerStalls[id].customer == msg.sender) {
      
      uint256 amount = hawkerStalls[id].cus_amount / 2;
      hawkerStalls[id].cus_amount -= amount;
      hawkerStalls[id].hawker_amount += amount;
      payable(msg.sender).transfer(amount);
      emit success("Partial payment successful", true, amount);
    } else {
      emit success("You are not the customer", false,0);
    }
  }

  //Customer side-> complete payment function
  //(where customer can assign the complete amount to hawker)
  function completePayment(string memory id) public {
    if (hawkerStalls[id].customer == msg.sender) {
      
      uint256 amount = hawkerStalls[id].cus_amount;
      hawkerStalls[id].cus_amount -= amount;
      hawkerStalls[id].hawker_amount += amount;
      emit success("Complete payment successful", true, amount);
    } else {
      emit success("You are not the customer", false,0);
    }
  }

  //Hawker side-> withdraw function (where hawker can withdraw the money)
  function hawker_withdraw(string memory id) public {
    if (hawkerStalls[id].hawker == msg.sender) {
      if (hawkerStalls[id].hawker_amount > 0) {
        
        uint256 amounte = hawkerStalls[id].hawker_amount;
        hawkerStalls[id].hawker_amount = 0;
        payable(msg.sender).transfer(amounte);
        emit success("Hawker Withdrawal successful", true, amounte);
      } else {
        emit success("You have no money to withdraw", false,0);
      }
    } else {
      emit success("You are not the hawker", false,0);
    }
  }
}
