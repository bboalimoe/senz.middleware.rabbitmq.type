/**
 * Created by zhanghengyang on 15/4/22.
 */

var sub = require('../rabbit_lib/subscriber');
var m_cache = require("sound-cache");
var m_task = require("./do_task");
var interval = require("./lib/interval");
var task_interval = interval.task_interval.check_interval;
var prev_interval = interval.prev_interval;
var logger = require("./lib/logger");


///*
//A new motion rawdata arrival called 'new_motion_arrival'
//A new sound rawdata arrival called 'new_sound_arrival'.
//    A new location rawdata arrival called 'new_location_arrival'.



var event = "new_sound_arrival";
var queue_name = "soundsOfArrival";


exports.init = function(){

    //


    sub.registerEvent(SoundCallback,queue_name,event);
    logger.debug("task_interval " + task_interval);

    setInterval(
        function () {
            if(m_cache.size()>0){
                var keys = m_cache.keys();
                var id = keys.pop();
                var tries = m_cache.get(id).tries;
                if(tries>0){
                    logger.warn("the id " + id + "tried" + m_cache.get(id).tries+ "times");
                    logger.warn("request pre-failed id service started, id >>" + id);
                    m_task.start(id);
                }
            }

        },task_interval);


    //setInterval(
    //    function () {
    //    if(m_cache.size()>0){
    //        var keys = m_cache.keys();
    //        keys.forEach(function(id){
    //            if(3>m_cache.get(id).tries>0 ) {
    //                logger.warn("request pre-failed id service started, id >>" + id);
    //                m_task.start(id);
    //            }
    //        });
    //
    //
    //    }
    //
    //},task_interval);

    //var rule = new timer.RecurrenceRule();
    //rule.minute = task_interval.check_interval;
    //var job = timer.scheduleJob(rule,m_task.start);
    //var cycle_check = timer.scheduleJob(rule,function(){
    //
    //    if (task_interval.check_interval === prev_interval){
    //
    //    }
    //    else {
    //        job.cancel();
    //        rule.minute = check_interval;
    //        job = timer.scheduleJob(rule,m_task.start);
    //    }
    //});

};

var SoundCallback = function(msg) {

    
    if(m_cache.get(msg.objectId)){
        return ;
    }
    logger.info("a new sound data arrived");
    logger.info("data is " + JSON.stringify(msg));
    var obj = {};
    obj["timestamp"] = msg.timestamp;
    obj["tries"] = 0;
    obj["user"] = {};
    //logger.warn(sb);
    m_cache.put(msg.objectId,obj);
    logger.warn("request new id service started, id >>" + msg.objectId);
    m_task.start(msg.objectId);


}