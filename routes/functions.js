const algorithm = 'aes-256-ctr';
const akshusecretKey = 'TihomHahs@UhskaHahs#19941995Bona';
const ankitsecretKey = 'Tikna@Itark#1989#1993Bonaventure';
const iv = '05bd9fbf50b124cd2bad8f31ca1e9ca4';           //crypto.randomBytes(16);
const FeeDetails = [
  {amount: 500, bonusPercent: 5},
  {amount: 400, bonusPercent: 5},
  {amount: 300, bonusPercent: 5},
  {amount: 200, bonusPercent: 5},
  {amount: 100, bonusPercent: 5},
  {amount: 0,   bonusPercent: 0}
];
  
const BonusDetails = [
  {amount: 500, bonusPercent: 5},
  {amount: 400, bonusPercent: 5},
  {amount: 300, bonusPercent: 5},
  {amount: 200, bonusPercent: 5},
  {amount: 100, bonusPercent: 5},
  {amount: 0,   bonusPercent: 0}
];

//zTvzr3p67VC61jmV54rIYu1545x4TlY
let debugTest = true;
// for sending email
const send = require('gmail-send')();
var mailOptions =  {
  user: 'viraagdental@gmail.com',
  pass: 'xcktxnafszblafzz',
  to:   '',
  subject: ''
  //html: ''
}


var arun_user={};
var arun_group={};
var arun_groupMember={};
var arun_auction={};
var arun_tournament={};
var arun_master=[];

const encrypt = (text) => {

    //console.log(`Text is ${text}`);
    const cipher = crypto.createCipheriv(algorithm, akshusecretKey, Buffer.from(iv, 'hex'));	
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    //myIv = iv.toString('hex');

    return encrypted.toString('hex');
};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, akshusecretKey, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

const dbencrypt = (text) => {

    //console.log(`Text is ${text}`);
    const cipher = crypto.createCipheriv(algorithm, ankitsecretKey, Buffer.from(iv, 'hex'));
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    //myIv = iv.toString('hex');

    return encrypted.toString('hex');
};

const dbdecrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, ankitsecretKey, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

const getLoginName = (name) => {
    return name.toLowerCase().replace(/\s/g, "");
  }
  
const getDisplayName = (name) => {
	console.log('xxx', name);
    var xxx = name.split(" ");
		for(let i=0; i<xxx.length; ++i) {
      let x = xxx[i].trim();
			let a = x.substr(0,1).toUpperCase();
			let b = x.substr(1, x.length).toLowerCase();
      xxx[i] = a + b;
			console.log(a, b, a+b);
    };
		console.log(xxx);
    return xxx.join(" ");
  }

const svrToDbText = (text) => {
	// first decrypt text sent by server
    let xxx = decrypt(text);
	// now encrypt this for database
	xxx = dbencrypt(xxx);
    return xxx;
  }

const dbToSvrText = (text) => {
	// first decrypt text of database
    let xxx = dbdecrypt(text);
	// now encrypt this for server
	xxx = encrypt(xxx);
    return xxx;
  }

async function nommalPasswordsendCricMail (dest, mailSubject, mailText) {

  //console.log(`Destination is ${dest}`);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
	  port: 587,
	  secure: false, // true for 465, false for other ports
    auth: {
      user: APLEMAILID,
      pass: 'Anob@1989#93'
    }
  });

  var mailOptions = {
    from: APLEMAILID,
    to: '',
    subject: '',
    text: ''
  };

  console.log("About to start");
  mailOptions.to = dest;
  mailOptions.subject = mailSubject;
  mailOptions.text = mailText;

  console.log(mailOptions.to);
  console.log(mailOptions.subject);
  console.log(mailOptions.text.length);
  console.log(`About to send email`);
  try {
    let response = await transporter.sendMail(mailOptions);
    console.log(response);
    return ({status: true, error: 'Email Successfully sent'});
  } catch (e) {
    console.log("error sending email");
    console.log(e);
    return ({status: false, error: 'error sending Email'});
  }
  // how to handle error. don't know may be use try/catch 
  /***
  transporter.sendMail(mailOptions, function(error, info){
	console.log('insertBefore');
    if (error) {
      console.log(error);
	  return ({status: false, error: error});
      //senderr(603, error);
    } else {
      console.log('Email sent: ' + info.response);
	  return ({status: true, error: info.response});
      //sendok('Email sent: ' + info.response);
    }
  });
  console.log('udi baba');
  ***/
} 

async function sendCricMail (dest, mailSubject, mailText) {

  // setup to, subject and text
  mailOptions.to = dest;
  mailOptions.subject = mailSubject;
  mailOptions.text = mailText;
	console.log(mailOptions);
	
  try {
    const res = await send(mailOptions);
    return {status: true, error: 'Email Successfully sent'};
  } catch (e) {
    console.log(e);
    return {status: false, error: 'error sending Email'}; 
  }
} 


async function sendCricHtmlMail (dest, mailSubject, mailText) {

  // setup to, subject and text
  mailOptions.to = dest;
  mailOptions.subject = mailSubject;
  mailOptions.html = mailText;

  try {
    const res = await send(mailOptions);
    return {status: true, error: 'Email Successfully sent'};
  } catch (e) {
    console.log(e);
    return {status: false, error: 'error sending Email'}; 
  }
} 

async function GroupMemberCount(groupid) {
  let memberCount = 0;
  let xxx = await GroupMember.aggregate([
    {$match: {gid: parseInt(groupid)}},
    {$group : {_id : "$gid", num_members : {$sum : 1}}}
  ]);
  if (xxx.length === 1) memberCount = xxx[0].num_members;
  return(memberCount);
}

/** calculate #time refill done by user till now **/
async function rechargeCount(userid) {
  let value = 0;
  let xxx = await Wallet.aggregate([
    {$match: {uid: parseInt(userid), isWallet: true, transType: WalletTransType.refill}},
    {$group : {_id : "$uid", count : {$sum : 1}}}
  ]);
  if (xxx.length === 1) value = xxx[0].count;
  return(value);
}

async function akshuGetUser(uid) {
  // let suid = uid.toString();
  let retUser = arun_user[uid];
  if (retUser) return retUser;

  if (debugTest) console.log(`read user ${uid} from database`);

  retUser = await User.findOne({uid: uid});
  if (retUser)
    arun_user[uid] = retUser;  // buffer this data
  return(retUser);
} 

function akshuUpdUser(userRec) {
  arun_user[userRec.uid] = userRec;
} 

// will buffer only emabled group
async function akshuGetGroup(gid) {
  let retGroup = arun_group[gid];
  if (retGroup) return retGroup;

  if (debugTest) console.log(`Read group ${gid} from database`);

  retGroup = await IPLGroup.findOne({gid: gid, enable: true});
  if (retGroup)
    arun_group[gid] = retGroup;
  return(retGroup);
} 


async function akshuGetGroupMembers(gid) {
  // let x = Object.keys(arun_groupMember);
  // console.log(x);

  let retGroupMember = arun_groupMember[gid];
  if (retGroupMember) {
    return retGroupMember;
  } 

  if (debugTest) console.log(`Read group members of Group ${gid} from database`);
  let myGroup = await akshuGetGroup(gid);
  if (!myGroup) return [];

  retGroupMember = await GroupMember.find({gid: gid});
  if (retGroupMember.length === myGroup.memberCount) {
    // only if all members joined, buffer this for future reference
    // console.log("buffering");
    arun_groupMember[gid] = retGroupMember;
  }
  return(retGroupMember);
} 

async function akshuGetGroupUsers(gid) {
	let retUserMembers = [];

	let myGroupMembers = await akshuGetGroupMembers(gid)
	for(gm=0; gm < myGroupMembers.length; ++gm) {
		let tmp = await akshuGetUser(myGroupMembers[gm].uid);
		if (tmp) retUserMembers.push(tmp);
	}
  return retUserMembers;
} 

function akshuUpdGroup(groupRec) {
  if (groupRec.enable)
    arun_group[groupRec.gid] = groupRec;
} 

// delete the entry of this group from buffer
function akshuDelGroup(groupRec) {
  delete arun_group[groupRec.gid];
  return;
} 



function akshuUpdGroupMember(gmRec) {
  let x = arun_groupMember[gmRec.gid];
  if (x) {
    let tmp = _.filter(x, u => u.uid !== gmRec.uid);
    tmp.push(gmRec);
    arun_groupMember[gmRec.gid] = tmp;
    // console.log(arun_groupMember);
  } 
}

async function akshuGetAuction(gid) {
  // let x = Object.keys(arun_auction);
  // console.log(x);

  let retVal = arun_auction[gid];
  if (retVal) return retVal;

  // not in buffer 
  
  if (debugTest) console.log(`Read Auction of Group ${gid} from database`);
  
  let myGroup = await akshuGetGroup(gid);
  if (!myGroup) return [];
  
  retVal = await Auction.find({gid: gid});
  if (myGroup.auctionStatus === "OVER")  {
    // console.log("buffering");
    arun_auction[gid] = retVal;
  } 
  return(retVal);
} 


async function akshuGetTournament(gid) {
  let retVal = arun_tournament[gid];
  if (retVal) return retVal;
  
  if (debugTest) console.log(`Read Tournament of group ${gid} from database`);
  let myGroup = await akshuGetGroup(gid);
  if (!myGroup)  return;

  retVal = await Tournament.findOne({name: myGroup.tournament})
  if (retVal)
    arun_tournament[gid] = retVal;
  return(retVal);
} 

async function getTournamentType(myGid) {
  // let xxx = await IPLGroup.findOne({gid: myGid});
	// let tRec = await Tournament.findOne({name: xxx.tournament});
	// let tmp = tRec.type;
	// return(tmp);
  let tType = "";
  let myTournament = await akshuGetTournament(myGid);
  if (myTournament) tType = myTournament.type;
  return tType;
}

async function getMaster(key) {
  let retVal =  arun_master.find(x => x.msKey === key);
  if (!retVal) {
    retVal = await M_MasterSetting.findOne({msKey: key});
    if (retVal) arun_master.push(retVal);
  }
  console.log(retVal.msValue);
  return (retVal) ? retVal.msValue : "";
}

async function setMaster(key, value) {
  let retVal =  arun_master.find(x => x.msKey === key);
  if (!retVal) {
    retVal = new M_MasterSetting();
    retVal.msKey = key;
    retVal.msValue = value;
    arun_master.push(retVal);
  } else {
    retVal.msValue = value;
  }
  await retVal.save();
  return
}


  
function calculateBonus(refillAmount) {
  let bonusAmount = 0;
  for(let i=0; i<BonusDetails.length; ++i) {
    if (refillAmount >= BonusDetails[i].amount) {
      bonusAmount = Math.floor(refillAmount * BonusDetails[i].bonusPercent/100.0);
      break;
    } 
  }
  // console.log(bonusAmount);
  return bonusAmount;
}

// break up of group fee from wallet and bonus
function feeBreakup(memberfee) {
  // console.log(memberfee);
  let bonusAmount = 0;
  for(let i=0; i<FeeDetails.length; ++i) {
    if (memberfee >= FeeDetails[i].amount) {
      bonusAmount = Math.floor(memberfee * FeeDetails[i].bonusPercent/100.0);
      break;
    } 
  }
  // console.log(bonusAmount);
  return {wallet: (memberfee-bonusAmount), bonus: bonusAmount};
}

async function getUserBalance(userid) {
  let tmp = {wallet: 0, bonus: 0};
  let myUid = Number(userid);

  let xxx = await Wallet.aggregate([
    {$match: {uid: myUid, isWallet: true}},
    {$group : {_id : "$uid", balance : {$sum : "$amount"}}}
  ]);
  if (xxx.length === 1) tmp.wallet = xxx[0].balance;

  xxx = await Wallet.aggregate([
    {$match: {uid: myUid, isWallet: false}},
    {$group : {_id : "$uid", balance : {$sum : "$amount"}}}
  ]);
  if (xxx.length === 1) tmp.bonus = xxx[0].balance;

  return tmp;
}

function numberDate(yr, mo, da) {
	return ((yr*100) + mo)*100 + da;
}

function intToString(n, sLen = 2)
{
	let x = "00000000000000000000000000000" + n;
	return x.slice(x.length-sLen, s.length);
}

ALPHABETSTR = [
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
"U", "V", "W", "X", "Y", "Z"
]

var ROOTDIR="";
function getRootDir() {
  if (ROOTDIR === "")
    ROOTDIR = process.cwd() + "/"
  return ROOTDIR;
} 

function getFileName(productName, productVersion, productType) {
  let myFile = getRootDir() + ARCHIVEDIR + 
    productName + "_" + 
    productVersion + "." + 
    productType;
  return myFile 
}

function fileExist(myFile) {
  status = fs.existsSync(myFile)
  return status;
}

function renameFile(oldfile, newFile) {
  // if new file already exists delete it
  if (fileExist(newFile))
    fs.unlinkSync(newFile);

    // now rename the file
  fs.renameSync(oldfile, newFile);
}

function deletefile(fileName) {
  if (fileExist(fileName))
    fs.unlinkSync(fileName);
}

function stringToBase64(originalString) {
	// The original utf8 string
	//let originalString = "GeeksforGeeks";
	// Create buffer object, specifying utf8 as encoding
	let bufferObj = Buffer.from(originalString, "utf8");		
	// Encode the Buffer as a base64 string
	let base64String = bufferObj.toString("base64");
	//console.log("The encoded base64 string is:", base64String);
	return base64String;
}

function base64ToString(base64string) {
	// The base64 encoded input string
	//let base64string = "R2Vla3Nmb3JHZWVrcw==";
		
	// Create a buffer from the string
	let bufferObj = Buffer.from(base64string, "base64");
	// Encode the Buffer as a utf8 string
	let decodedString = bufferObj.toString("utf8");
	//console.log("The decoded string:", decodedString);
	return decodedString
}

module.exports = {
	ALPHABETSTR,
  getLoginName, getDisplayName,
  encrypt, decrypt, dbencrypt, dbdecrypt,
  dbToSvrText, svrToDbText,
  GroupMemberCount,
  sendCricMail, sendCricHtmlMail,
  // master
  getMaster, setMaster,
  // get
  akshuGetUser,
  akshuGetGroup, akshuGetGroupMembers, akshuGetGroupUsers,
  akshuGetAuction,
  akshuGetTournament, getTournamentType,
  // update
  akshuUpdUser,
  akshuUpdGroup, akshuUpdGroupMember,
  // delete
  akshuDelGroup,
  feeBreakup, getUserBalance,
  calculateBonus,
	rechargeCount,
	numberDate, intToString,
	stringToBase64, base64ToString
}; 
