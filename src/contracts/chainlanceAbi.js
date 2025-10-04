// src/contracts/chainlanceAbi.js
export const CHAINLANCE_ABI = [
  // -------- Events --------
  {
    "anonymous": false, "inputs": [
      {"indexed": true,"name": "accountAddress","type": "address"},
      {"indexed": false,"name": "isEmployee_","type": "bool"},
      {"indexed": false,"name": "isEmployer_","type": "bool"},
      {"indexed": false,"name": "isMiddleman_","type": "bool"}
    ], "name": "accountCreated", "type": "event"
  },
  {
    "anonymous": false, "inputs": [
      {"indexed": true,"name": "offeredBy","type": "address"},
      {"indexed": false,"name": "offeredWorkId","type": "bytes32"}
    ], "name": "workOffered", "type": "event"
  },
  {"anonymous": false,"inputs":[{"indexed": false,"name":"offeredWorkId","type":"bytes32"}],"name":"workDeleted","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": true,"name":"applicant","type":"address"},{"indexed": false,"name":"offeredWorkId","type":"bytes32"}],"name":"appliedToWork","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": true,"name":"employee","type":"address"},{"indexed": false,"name":"agreementId","type":"bytes32"}],"name":"recruitedEmployee","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": false,"name":"suggested","type":"address"},{"indexed": false,"name":"middleman","type":"address"},{"indexed": false,"name":"agreementId","type":"bytes32"}],"name":"suggestedMiddleman","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": false,"name":"agreementId","type":"bytes32"},{"indexed": false,"name":"middleman","type":"address"}],"name":"askedMiddleman","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": false,"name":"agreementId","type":"bytes32"}],"name":"middlemanValidated","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": false,"name":"agreementId","type":"bytes32"}],"name":"employeeDone","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": false,"name":"agreementId","type":"bytes32"}],"name":"employerValidated","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": true,"name":"raisedBy","type":"address"},{"indexed": false,"name":"agreementId","type":"bytes32"}],"name":"disputeRaised","type":"event"},
  {"anonymous": false,"inputs":[{"indexed": false,"name":"agreementId","type":"bytes32"}],"name":"disputeResolved","type":"event"},

  // -------- Views --------
  {"inputs":[],"name":"balanceRecieved","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"numOfAgreements","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"numOfOfferedWorks","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},

  // Mapping getters for structs
  {"inputs":[{"name":"","type":"bytes32"}],"name":"offeredWorks","outputs":[
    {"name":"offeredWorkId","type":"bytes32"},
    {"name":"employer","type":"address"},
    {"name":"amountToStake","type":"uint256"},
    {"name":"isSealed","type":"bool"}
  ],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"","type":"bytes32"}],"name":"agreements","outputs":[
    {"name":"agreementId","type":"bytes32"},
    {"name":"employer","type":"address"},
    {"name":"employee","type":"address"},
    {"name":"middleman","type":"address"},
    {"name":"amountForEmployee","type":"uint256"},
    {"name":"askedMiddlemanNumber","type":"uint256"},
    {"name":"employeeDone","type":"bool"},
    {"name":"employerValidate","type":"bool"},
    {"name":"disputeRaised","type":"bool"},
    {"name":"resolveCheck","type":"bool"}
  ],"stateMutability":"view","type":"function"},

  // Convenience getters
  {"inputs":[],"name":"getOfferedWorkIds","outputs":[{"type":"bytes32[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getOfferedWorks","outputs":[{"components":[
    {"name":"offeredWorkId","type":"bytes32"},
    {"name":"employer","type":"address"},
    {"name":"amountToStake","type":"uint256"},
    {"name":"isSealed","type":"bool"}
  ],"type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getAgreementIds","outputs":[{"type":"bytes32[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getAgreements","outputs":[{"components":[
    {"name":"agreementId","type":"bytes32"},
    {"name":"employer","type":"address"},
    {"name":"employee","type":"address"},
    {"name":"middleman","type":"address"},
    {"name":"amountForEmployee","type":"uint256"},
    {"name":"askedMiddlemanNumber","type":"uint256"},
    {"name":"employeeDone","type":"bool"},
    {"name":"employerValidate","type":"bool"},
    {"name":"disputeRaised","type":"bool"},
    {"name":"resolveCheck","type":"bool"}
  ],"type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"}],"name":"getAgreement","outputs":[{"components":[
    {"name":"agreementId","type":"bytes32"},
    {"name":"employer","type":"address"},
    {"name":"employee","type":"address"},
    {"name":"middleman","type":"address"},
    {"name":"amountForEmployee","type":"uint256"},
    {"name":"askedMiddlemanNumber","type":"uint256"},
    {"name":"employeeDone","type":"bool"},
    {"name":"employerValidate","type":"bool"},
    {"name":"disputeRaised","type":"bool"},
    {"name":"resolveCheck","type":"bool"}
  ],"type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"offeredWorkId_","type":"bytes32"}],"name":"getCandidates","outputs":[{"type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"},{"name":"whichMiddleman_","type":"uint256"}],"name":"getAskedMiddleman","outputs":[{"type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"}],"name":"getMiddleman","outputs":[{"type":"address"}],"stateMutability":"view","type":"function"},

  // -------- Writes --------
  {"inputs":[{"name":"isEmployee_","type":"bool"},{"name":"isEmployer_","type":"bool"},{"name":"isMiddleman_","type":"bool"}],"name":"newAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"offerWork","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"name":"offeredWorkId_","type":"bytes32"}],"name":"deleteWork","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"offeredWorkId_","type":"bytes32"}],"name":"applyOfferedWork","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"offeredWorkId_","type":"bytes32"},{"name":"whichCandidate_","type":"uint256"}],"name":"recruitEmployee","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"}],"name":"setEmployeeDone","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"}],"name":"setEmployerValidate","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"},{"name":"middleman_","type":"address"}],"name":"suggestMiddleman","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"},{"name":"whichMiddleman_","type":"uint256"}],"name":"middleManValidate","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"}],"name":"raiseDispute","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"agreementId_","type":"bytes32"},{"name":"employeePercent","type":"uint256"},{"name":"employerPercent","type":"uint256"}],"name":"resolveDisputeMiddleman","outputs":[],"stateMutability":"nonpayable","type":"function"}
];
