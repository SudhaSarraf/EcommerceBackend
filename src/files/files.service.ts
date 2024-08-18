import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  async processFile(file: any, oldName?: string): Promise<string> {
    try {
      const fileName = oldName ?? uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException('Something went wrong while uploading file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async processMultipleFiles(files: Express.Multer.File[], existing?: string): Promise<string[]> {
    const filePath = path.resolve(__dirname, 'static');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    let namesArr: string[] = [];
    if (existing) {
      try {
        namesArr = existing.split(',');
      } catch (error) {
        throw new HttpException('Invalid value for existing parameter', HttpStatus.BAD_REQUEST);
      }
    }

    const filesInDir = fs.readdirSync(filePath);
    const newNames: string[] = [];

    files.forEach(file => {
      let fileName: string;

      // Check if there's a matching name in the existing array
      const match = namesArr.find(existingName => filesInDir.includes(existingName));

      if (match) {
        // Overwrite the existing file
        fileName = match;
      } else {
        // Create a new file name
        fileName = uuid.v4() + '.jpg';
      }

      // Save the file
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      newNames.push(fileName);
    });

    return newNames;
  }
}

