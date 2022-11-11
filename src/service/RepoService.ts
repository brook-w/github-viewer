/**
 * 关于仓库获取服务
 */

import { GetDB } from '@/db'

export namespace Github {
    export type RepoInfo = {
        id: number,
        name: string,
        full_name: string,
        html_url: string,
        description: string
    }
}


export namespace Github {
    const REPO_DB_PATH = '/github.db'
    export class RepoService {
        public async GetRepoInfo(repoName: string): Promise<RepoInfo> {
            // 1. 从数据库查询
            const db = await GetDB(REPO_DB_PATH);
            const sql = `SELECT * FROM repo WHERE name = '${repoName}'`
            const repoInfo = await db.query(sql)
            return repoInfo[0] as RepoInfo;
        }

        public async GetRepoList(): Promise<Array<RepoInfo>> {
            // 1. 从数据库查询
            const db = await GetDB(REPO_DB_PATH);
            const repoInfo = await db.query("SELECT * FROM repo")
            return repoInfo as Array<RepoInfo>;
        }
    }
}
