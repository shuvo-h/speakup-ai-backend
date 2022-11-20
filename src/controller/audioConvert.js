
const Gtts = require('gtts');
const { updateCardAfterConvertService } = require('../services/convertCardService');
const { updateTestIpUserAfterConvByIdService } = require('../services/testIpUserServices');

async function convertAudioCtl (req,res,next) {
    const {text,lang} = req.body;
    const {convertCard_id} = req.query;
    
    // check if language is accurate
   try {
        // step 1: set the response header
        // step 2: pipe the stream to res when stream is available, eg. after file opening
        // step 3: count the file size as a chunk while data available
        // step 4: end the response when stream file is ended
        // step 5: end the response when error occured
        
       const gtts = new Gtts(text, lang);
        //    gtts.stream().pipe(res);  // short form
        const audioReadableStream = gtts.stream();
        // pipe this stream with res to send to client
        audioReadableStream.pipe(res);

        // calculate size of the stream data
        let audioSize = 0; // 0 Bytes
        audioReadableStream.on('data',function(chunk){
            // console.log((audioSize/(1024*1024)).toFixed(2)," MB");
            audioSize += chunk.length;
        })
        res.writeHead(206, {
            'size': audioSize,
            'Content-Type': 'audio/mpeg',
            'accept-ranges': 'bytes',
        });
        
        audioReadableStream.on('end',async function(){
            // console.log("Audio size = ", audioSize/(1024*1024)," MB");
            // before ending the response, update the convertCard: file_count,size,-req_per_day_reamining,character_limit_reamining
            const cardUpdateRes = await updateCardAfterConvertService(convertCard_id,{size:audioSize/(1024*1024), textLength:text.length})
            res.end();
        })
        audioReadableStream.on('error',function(err){
           console.log(err.message);
           res.sendStatus(404);
        })
        
   } catch (error) {
    console.log(error);
    res.status(500).json({error:true,message:error.message})
   }
}


async function convertFreeAudioCtl (req,res,next) {
    const {text,lang} = req.body;
    
    // check if language is accurate
   try {
        
       const gtts = new Gtts(text, lang);
        //    gtts.stream().pipe(res);  // short form
        const audioReadableStream = gtts.stream();
        // pipe this stream with res to send to client
        audioReadableStream.pipe(res);

        // calculate size of the stream data
        let audioSize = 0; // 0 Bytes
        audioReadableStream.on('data',function(chunk){
            // console.log((audioSize/(1024*1024)).toFixed(2)," MB");
            audioSize += chunk.length;
        })
        
        audioReadableStream.on('end', async function(){
            // console.log("Audio size = ", audioSize/(1024*1024)," MB");
            // update add the ip address's limit for today
            const charLimitForIpUpdateRes = await updateTestIpUserAfterConvByIdService (req.ipDoc_id,{characters_used:text.length});
            // console.log(charLimitForIpUpdateRes,"charLimitForIpUpdateRes");
            res.end();
        })
        audioReadableStream.on('error',function(err){
           console.log(err.message);
            res.end();
        })
        
   } catch (error) {
    console.log(error);
    res.status(500).json({error:true,message:error.message})
   }
}





module.exports = {
    convertAudioCtl,
    convertFreeAudioCtl
}



/*
async function convertAudioCtl (req,res,next) {
    const {text,lang} = req.body;
    // check if language is accurate
   try {
        // step 1: set the response header

        // step 2: pipe the stream to res when stream is available, eg. after file opening
        // step 3: count the file size as a chunk while data available
        // step 4: end the response when stream file is ended
        // step 5: end the response when error occured
       const gtts = new Gtts(text, lang);
        //    gtts.stream().pipe(res);  // short form
        const audioReadableStream = gtts.stream();
        // pipe this stream with res to send to client
        audioReadableStream.pipe(res);

        // calculate size of the stream data
        let audioSize = 0; // 0 Bytes
        audioReadableStream.on('data',(chunk){
            // console.log((audioSize/(1024*1024)).toFixed(2)," MB");
            audioSize += chunk.length;
        })
        
        audioReadableStream.on('end',(){
            // console.log("Audio size = ", audioSize/(1024*1024)," MB");
            res.end();
        })
        audioReadableStream.on('error',(err){
           console.log(err.message);
            res.end();
        })
        
   } catch (error) {
    console.log(error);
    res.status(500).json({error:true,message:error.message})
   }
}

*/

