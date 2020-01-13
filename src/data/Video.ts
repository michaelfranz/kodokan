import RNFS, {DownloadProgressCallbackResult} from 'react-native-fs'

interface IVideoParameters {
    name: string
    thumbnail: URL
    size: number
}

const REMOTE_URL_ROOT = 'https://s3.eu-west-2.amazonaws.com/kodokanpro'

export default class Video {
    public name: string
    public thumbnail: URL
    public size: number
    private filename: string

    constructor({name, size, thumbnail}: IVideoParameters) {
        this.name = name
        this.size = size
        this.thumbnail = thumbnail
        this.filename = name + '.m4v'
    }

    public async isDownloaded(): Promise<boolean> {
        return await RNFS.exists(this.localPath())
    }

    public async download(progressCallback: (bytesWritten: number, contentLength: number) => void): Promise<boolean> {
        if (await this.isDownloaded()) {
            return true
        }

        const progress = (res: DownloadProgressCallbackResult) => {
            progressCallback(res.bytesWritten, res.contentLength)
        }

        const fromUrl = this.remoteURI()

        const toFile = this.localPath()

        const readTimeout = 10000

        await RNFS.downloadFile({fromUrl, progress, readTimeout, toFile})

        return true
    }

    public async removeDownload(): Promise<boolean> {
        RNFS.unlink(this.localPath())
            .then(() => {
                return true
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch(err => {
                console.warn('File not deleted: ' + err.message)
            })
        return false
    }

    public async uri(): Promise<string> {
        if (await this.isDownloaded()) {
            return this.localURI()
        } else {
            return this.remoteURI()
        }
    }

    private remoteURI(): string {
        return [REMOTE_URL_ROOT, this.filename].join('/')
    }

    private localURI(): string {
        return this.localPath()
    }

    private localPath(): string {
        return [RNFS.DocumentDirectoryPath, this.filename].join('/')
    }
}
