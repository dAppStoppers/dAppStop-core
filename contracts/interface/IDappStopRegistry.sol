// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/*--------------------------------------------------------------
 ______                    ______                   
(______)                  / _____) _                 @d1onys1us
 _     _ _____ ____  ____( (____ _| |_ ___  ____     @2manslkh
| |   | (____ |  _ \|  _ \\____ (_   _/ _ \|  _ \    @MorikiKamio
| |__/ // ___ | |_| | |_| _____) )| || |_| | |_| |   @yukiwaki
|_____/ \_____|  __/|  __(______/  \__\___/|  __/ 
              |_|   |_|                    |_|    ETHBOGOTA2022                             
----------------------------------------------------------------*/

interface IDappStopRegistry {
    struct DappInfo {
        address creator;
        string popURI;
        string ceramicURI;
        uint256 price;
    }

    /**
     * @notice Register an app on DappStopRegistry.
     */
    function register(DappInfo memory dappInfo) external;

    /**
     * @notice Update an app on DappStopRegistry.
     */
    function update(uint256 _dappId, DappInfo memory dappInfo) external payable;

    /**
     * @notice Get total amount of Dapps Registered.
     */
    function getDappCount() external view returns (uint256);

    /**
     * @notice Get information of a Dapp based on the dappId.
     */
    function getDappInfo(uint256 _dappId)
        external
        view
        returns (DappInfo memory);

    /**
     * @notice Get information of a Dapp based on the dappId.
     */
    function getCreator(uint256 _dappId) external view returns (address);

    /**
     * @notice Get information of a Dapp based on the dappId.
     */
    function getPrice(uint256 _dappId) external view returns (uint256);

    /**
     * @notice Get information of a Dapp based on the dappId. (Ceramic URI)
     */
    function getCeramicURI(uint256 _dappId)
        external
        view
        returns (string memory);

    /**
     * @notice Get metadata for the PoP NFT based on the dappId. (IPFS URI)
     */
    function getPoPURI(uint256 _dappId) external view returns (string memory);

    /**
     * @notice Purchase a dapp based on the dappId.
     */
    function buy(uint256 _dappId) external payable;
}
