// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**--------------------------------------------------------------
 ______                    ______                   
(______)                  / _____) _                 @d1onys1us
 _     _ _____ ____  ____( (____ _| |_ ___  ____     @2manslkh
| |   | (____ |  _ \|  _ \\____ (_   _/ _ \|  _ \    @MorikiKamio
| |__/ // ___ | |_| | |_| _____) )| || |_| | |_| |   @yukiwaki
|_____/ \_____|  __/|  __(______/  \__\___/|  __/ 
              |_|   |_|                    |_|    ETHBOGOTA2022                             
----------------------------------------------------------------*/

import "./DappStopPoP.sol";
import "./interface/IDappStopRegistry.sol";

/// @title DappStopRegistry
/// @notice DappStopRegistry allows game developers to register their games on dAppStop.
/// @notice When a creator registers their game, a DappStopPop NFT collection is created for them.
contract DappStopRegistry is IDappStopRegistry {
    DappStopPoP public DAPPSTOP_POP;

    mapping(uint256 => DappInfo) public dappInfo;

    event Bought(address indexed buyer, uint256 indexed dappId);
    event Registered(
        address indexed creator,
        uint256 indexed dappId,
        DappInfo dappInfo
    );
    event Updated(uint256 indexed dappId, DappInfo dappInfo);

    constructor() {
        DAPPSTOP_POP = new DappStopPoP(address(this));
    }

    function buy(uint256 _dappId) external payable override {
        require(
            msg.value == getPrice(_dappId),
            "DappStopRegistry: You must send the exact amount of ETH to buy this NFT"
        );

        // Transfer ETH to creator
        payable(getCreator(_dappId)).transfer(msg.value);
        DAPPSTOP_POP.mint(msg.sender, _dappId, "");
        emit Bought(msg.sender, _dappId);
    }

    function register(DappInfo memory _dappInfo) external override {
        uint256 dappId = DAPPSTOP_POP.tokenIndex();
        dappInfo[dappId] = _dappInfo;

        DAPPSTOP_POP.create(msg.sender, _dappInfo.price, _dappInfo.popURI);

        emit Registered(msg.sender, dappId, _dappInfo);
    }

    function update(uint256 _dappId, DappInfo memory _dappInfo)
        external
        payable
        override
    {
        require(
            msg.sender == getCreator(_dappId),
            "DappStopRegistry: You must be the creator of this dApp"
        );

        dappInfo[_dappId] = _dappInfo;

        emit Updated(_dappId, _dappInfo);
    }

    function getCeramicURI(uint256 _dappId)
        external
        view
        override
        returns (string memory)
    {
        return dappInfo[_dappId].ceramicURI;
    }

    function getPoPURI(uint256 _dappId)
        external
        view
        override
        returns (string memory)
    {
        return dappInfo[_dappId].popURI;
    }

    function getPrice(uint256 _dappId) public view override returns (uint256) {
        return dappInfo[_dappId].price;
    }

    function getCreator(uint256 _dappId)
        public
        view
        override
        returns (address)
    {
        return dappInfo[_dappId].creator;
    }

    function getDappCount() external view override returns (uint256) {
        return DAPPSTOP_POP.tokenIndex();
    }

    function getDappInfo(uint256 _dappId)
        external
        view
        override
        returns (DappInfo memory)
    {
        return dappInfo[_dappId];
    }
}
