// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BuyMeACoffee {
    // Event để phát ra khi ai đó mua cà phê
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        uint256 amount
    );

    // Cấu trúc dữ liệu của một Memo
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        uint256 amount;
    }

    // Danh sách lưu trữ tất cả memos
    Memo[] public memos;

    // Địa chỉ của chủ sở hữu hợp đồng (người nhận tiền)
    address payable public owner;

    constructor() {
        // Gán người tạo hợp đồng làm chủ sở hữu
        owner = payable(msg.sender);
    }

    /**
     * @dev Hàm dùng để mua cà phê cho chủ sở hữu
     * @param _name Tên người mua
     * @param _message Lời nhắn
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        // Phải gửi lượng ETH lớn hơn 0
        require(msg.value > 0, "Can't buy coffee with 0 ETH");

        // Thêm memo vào mảng
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            msg.value
        ));

        // Phát ra event
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            msg.value
        );
    }

    /**
     * @dev Rút tiền từ hợp đồng về ví chủ sở hữu
     */
    function withdrawTips() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance > 0, "No balance to withdraw");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Lấy toàn bộ danh sách memo
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
