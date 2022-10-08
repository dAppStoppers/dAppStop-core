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

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IDappStopPoP is IERC1155 {
    function totalSupply(uint256 _id) external view returns (uint256);

    function create(address creator, string memory uri)
        external
        returns (uint256);

    function mint(
        address _to,
        uint256 _id,
        bytes memory _data
    ) external payable;
}
