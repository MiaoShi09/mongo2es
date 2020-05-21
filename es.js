/**
 * libs
 */

const { exec, execSync  } = require('child_process')
const config = {
    es:"http://127.0.0.1:9200",
    es_token:""
}
function cmd_sync(cmd) {
    try {
        let buf = execSync(
            cmd, 
            {
                shell: true,
                encoding: 'utf-8',
                timeout: config.cmd_timeout,
                stdio:[0]
            }
        )
        let json = JSON.parse(buf)
        return {
            result: json
        } 
    } catch (e) {
        return {
            error: e.toString()
        }
    }
}
 


function es_bulk(string){
    const cmd_head = `curl -XPOST -H "Content-Type: application/x-ndjson" -H "Authorization: Basic ${config.es_token}" -d "`
    const cmd_tail = '" ' + config.es + '/_bulk?filter_path=items.*.error'
    const cmd = cmd_head + string.replace(/"/g, '\\"') + cmd_tail
    return cmd_sync(cmd)
}
function es_bulk_file(file){
    const cmd_head = `curl -XPOST -H "Content-Type: application/x-ndjson" -H "Authorization: Basic ${config.es_token}" --data-binary @`
    const cmd_tail = ' ' + config.es + '/_bulk?filter_path=items.*.error'
    const cmd = cmd_head + file + cmd_tail
    return cmd_sync(cmd)
}



module.exports = {
    es_bulk,
    es_bulk_file
}