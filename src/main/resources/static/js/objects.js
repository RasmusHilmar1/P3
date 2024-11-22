export {Berth, Boat, PendingBoat, Member};

// Classes for the different objects from database
class Berth {
    constructor(berthID, name, availability, length, width, depth, pierId){
        this.berthID = berthID;
        this.name = name;
        this.availability = availability;
        this.length = length;
        this.width = width;
        this.depth = depth;
        this.pierId = pierId;
    }
}

class Boat {
    constructor(boatID, memberID, berthID, name, type, manufacturer, length, width, draught, insurance){
        this.boatID = boatID;
        this.memberID = memberID;
        this.berthID = berthID;
        this.name = name;
        this.type = type;
        this.manufacturer = manufacturer;
        this.length = length;
        this.width = width;
        this.draught = draught;
        this.insurance = insurance;
    }
}

class PendingBoat {
    constructor(id, boat){
        this.id = id;
        this.boat = {
            boatID: boat.boatID,
            memberID: boat.memberID,
            berthID: boat.berthID,
            name: boat.name,
            type: boat.type,
            manufacturer: boat.manufacturer,
            length: boat.length,
            width: boat.width,
            draught: boat.draught,
            insurance: boat.insurance,
        }
    }
}

class Member {
    constructor(id, member){
        this.id = id;
        this.member = {
            memberID: member.memberID,
            name: member.name,
            address: member.address,
            email: member.email,
            dateofbirth: member.dateofbirth,
            phonenumber: member.phonenumber,
            boatownership: member.boatownership,
        }
    }
}





