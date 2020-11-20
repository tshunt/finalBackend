//CODE DEVELOPED FOLLOWING TUTORIAL LOCATED AT
//https://www.youtube.com/watch?v=l2wTSopPv0Q
//CREDIT KETAN MAYER-PATEL 

const store = require('data-store')({ path: process.cwd() + '/data/meets.json' });

class Meeting{

    constructor(className, time, date, attendees, location, id, owner, desc, comments){
        this.className = className;
        this.time = time;
        this.date = date;
        this.attendees = attendees;
        this.location = location;
        this.id = id;
        this.owner = owner
        this.desc = desc;
        this.comments = comments
    }

    update() {
        store.set(this.id.toString(), this);
    }

    delete() {
        store.del(this.id.toString());
    }

}
Meeting.getAll = function(){
    let toRet = new Array();
    let ids = Meeting.getIDS();
    ids.forEach(function (meeting){
        let cl = store.get(meeting.toString());
        toRet.push(cl);
    });
    return toRet;
}

Meeting.getNames = function(){
    let toRet = new Array();
    let ids = Meeting.getIDS();
    ids.forEach(function (meeting){
        let cl = store.get(meeting.toString());
        if(!toRet.includes(cl.className)){
            toRet.push(cl.className);
        }
    });
    return toRet;
}

Meeting.getIDS = function(){
    //Return ids
    return Object.keys(store.data).map((id => {return parseInt(id);}));
}

Meeting.getIDSbyOwner = function(owner){
    return Object.keys(store.data).filter(id => store.get(id).attendees.find((person) => person == owner)).map((id => {return parseInt(id);}));
}

Meeting.findByID = (id) => {
    let mdata = store.get(id);
    if (mdata != null) {
        return new Meeting(mdata.className, mdata.time, mdata.date, mdata.attendees, mdata.location, mdata.id, mdata.owner, mdata.desc, mdata.comments);
    }
    return null;
}

Meeting.next_id = Meeting.getIDS().reduce((max, next_id) => {
    if (max < next_id) {
        return next_id;
    }
    return max;
}, -1) + 1;

Meeting.create = function(className, time, date, attendees, location, owner, desc, comments){
    let id = Meeting.next_id;
    Meeting.next_id += 1;
    let meet = new Meeting(className, time, date, attendees, location, id, owner, desc, comments);
    store.set(meet.id.toString(), meet);
    return meet;
}

module.exports = Meeting;