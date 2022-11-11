// const workerUrl = new URL("sql.js-httpvfs/dist/sqlite.worker.js", import.meta.url);
// const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

import workerUrl from "sql.js-httpvfs/dist/sqlite.worker.js?url";
import wasmUrl from "sql.js-httpvfs/dist/sql-wasm.wasm?url";
import * as Comlink from "comlink";
import {LazyHttpDatabase} from "sql.js-httpvfs/dist/sqlite.worker";
import {
    createDbWorker,
    PageReadLog,
    SqliteStats,
    WorkerHttpvfs,
} from "sql.js-httpvfs"


export const GetDB = async (dbUrl: string) => {
    const worker = await createDbWorker(
        [
            {
                from: "inline",
                config: {
                    serverMode: "full",
                    url: dbUrl,
                    requestChunkSize: 4096,
                },
            },
        ],
        workerUrl.toString(),
        wasmUrl.toString()
    );


    let sqlstr = "CREATE TABLE hello (a int, b char); \
INSERT INTO hello VALUES (0, 'hello'); \
INSERT INTO hello VALUES (1, 'world');";
    const run =  await worker.db.run(sqlstr)
    console.log("run",run)

    // const stmt = await worker.db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");
    //
    // const result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
    // console.log(result); // Will print {a:1, b:'world'}




    // console.log("run", run)
    // const exec1 = await run.exec("INSERT INTO mytable values ('1','2')")
    // console.log("exec", exec1)
    // const exec2 = await run.exec("SELECT * FROM mytable")
    // console.log("exec", exec2)

    return worker.db;
};
