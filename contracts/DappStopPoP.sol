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

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./interface/IDappStopPoP.sol";

/// @title DappStopPoP
/// @notice DappStopPoP is a non-transferrable NFT that indicates a proof of purchase of a dApp on dAppStop.
contract DappStopPoP is ERC1155, IDappStopPoP {
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public tokenSupply;
    // Each individual app will have a customUri
    mapping(uint256 => string) public customUri;

    // Contract name
    string public name;
    string public symbol;
    // Dappstop Registry Address
    address public REGISTRY;
    // Token Index
    uint256 public index;

    /**
     * @dev Require msg.sender to be the registry
     */
    modifier registryOnly() {
        require(msg.sender == REGISTRY, "DappStopPoP: Registry Only");
        _;
    }

    constructor() ERC1155("") {
        name = "DappStopPoP";
        symbol = "DSPOP";
    }

    function setRegistry(address registry) external {
        require(REGISTRY == address(0), "DappStopPoP: Registry Already Set!");
        REGISTRY = registry;
    }

    function updateURI(uint256 _id, string memory _uri) external registryOnly {
        customUri[_id] = _uri;
    }

    function uri(uint256 _id) public view override returns (string memory) {
        require(_exists(_id), "DappStopPoP: Non-existent token");
        // We have to convert string to bytes to check for existence
        return customUri[_id];
    }

    /**
     * @dev Returns the total quantity for a token ID
     * @param _id uint256 ID of the token to query
     * @return amount of token in existence
     */
    function totalSupply(uint256 _id) public view returns (uint256) {
        return tokenSupply[_id];
    }

    /**
     * @dev Returns the current token Index
     * @return Current token index
     */
    function tokenIndex() public view returns (uint256) {
        return index;
    }

    /**
     * @dev Creates a new token
     * @param _creator address of the creator of the token
     * @param _uri string URI for the token
     * @return tokenId ID of the token
     */
    function create(address _creator, string memory _uri)
        public
        registryOnly
        returns (uint256)
    {
        uint256 _id = index;
        creators[_id] = _creator;

        if (bytes(_uri).length > 0) {
            customUri[_id] = _uri;
            emit URI(_uri, _id);
        }

        index++;
        return _id;
    }

    /**
     * @dev Mints a token
     * @param _to address of the future owner of the token
     * @param _id uint256 ID of the token to mint
     * @param _data bytes data to pass if receiver is contract
     */
    function mint(
        address _to,
        uint256 _id,
        bytes memory _data
    ) external payable registryOnly {
        require(_exists(_id), "DappStopPoP: Non-existent token!");
        require(balanceOf(_to, _id) == 0, "DappStopPoP: Already minted!");
        _mint(_to, _id, 1, _data);
        tokenSupply[_id] += 1;
    }

    /**
     * @dev Returns whether the specified token exists by checking to see if it has a creator
     * @param _id uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 _id) internal view returns (bool) {
        return creators[_id] != address(0);
    }

    function exists(uint256 _id) external view returns (bool) {
        return _exists(_id);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        require(from == address(0), "DappStopPoP: Non-transferrable");
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
