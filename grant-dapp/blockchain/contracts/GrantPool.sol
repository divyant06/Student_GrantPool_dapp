// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract GrantPool is VRFConsumerBaseV2 {
    // Chainlink VRF variables
    VRFCoordinatorV2Interface immutable i_vrfCoordinator;
    bytes32 immutable i_gasLane;
    uint64 immutable i_subscriptionId;
    uint16 immutable i_requestConfirmations;
    uint32 immutable i_callbackGasLimit;
    uint32 immutable i_numWords;

    // Grant Pool state variables
    address public s_recentWinner;
    enum PoolState { OPEN, CALCULATING }
    PoolState public s_poolState;

    // Advanced Data Structure for Students
    struct Student {
        address wallet;
        uint256 timestamp;
    }

    Student[] public s_applicants;
    uint256 public s_grantPoolBalance;

    // Events for Front-end listening
    event GrantSponsored(address indexed sponsor, uint256 amount);
    event ApplicationSubmitted(address indexed student);
    event WinnerRequested(uint256 indexed requestId);
    event GrantAwarded(address indexed winner, uint256 amount);

    constructor(
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_requestConfirmations = requestConfirmations;
        i_callbackGasLimit = callbackGasLimit;
        i_numWords = 1;
        s_poolState = PoolState.OPEN;
    }

    // 1. Sponsor Function: Anyone can add funds without entering the draw
    function sponsorGrant() external payable {
        require(msg.value > 0, "Must send ETH to sponsor");
        s_grantPoolBalance += msg.value;
        emit GrantSponsored(msg.sender, msg.value);
    }

    // 2. Student Apply Function: Registers a student for the grant
    function applyForGrant() external {
        require(s_poolState == PoolState.OPEN, "Grant pool is currently closed");
        
        // Prevent duplicate entries
        for (uint256 i = 0; i < s_applicants.length; i++) {
            require(s_applicants[i].wallet != msg.sender, "Already applied");
        }
        
        s_applicants.push(Student({
            wallet: msg.sender,
            timestamp: block.timestamp
        }));
        
        emit ApplicationSubmitted(msg.sender);
    }

    // 3. Trigger the Draw: Requests random number from Chainlink Oracle
    function pickWinner() external {
        require(s_poolState == PoolState.OPEN, "Pool not open");
        require(s_applicants.length > 0, "No applicants");
        require(s_grantPoolBalance > 0, "No funds to award");

        s_poolState = PoolState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            i_requestConfirmations,
            i_callbackGasLimit,
            i_numWords
        );
        emit WinnerRequested(requestId);
    }

    // 4. Automated Payout: Called by Chainlink VRF securely
    function fulfillRandomWords(uint256 /* requestId */, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_applicants.length;
        address winner = s_applicants[indexOfWinner].wallet;
        
        s_recentWinner = winner;
        uint256 awardAmount = s_grantPoolBalance;
        
        // Reset the pool for the next round
        s_grantPoolBalance = 0;
        delete s_applicants;
        s_poolState = PoolState.OPEN;

        // Auto-transfer funds to the winning student
        (bool success, ) = winner.call{value: awardAmount}("");
        require(success, "Transfer failed");
        
        emit GrantAwarded(winner, awardAmount);
    }

    // Helper function for the front-end
    function getApplicantsCount() external view returns (uint256) {
        return s_applicants.length;
    }
}