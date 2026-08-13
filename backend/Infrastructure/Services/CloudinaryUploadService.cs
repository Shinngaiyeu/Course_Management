using Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Infrastructure.Services;

public class CloudinaryUploadService : IUploadService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryUploadService(IConfiguration configuration)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string folderName)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("File is empty.");

        contentType = contentType.ToLower();

        if (contentType.StartsWith("video/"))
        {
            var uploadParams = new VideoUploadParams()
            {
                File = new FileDescription(fileName, fileStream),
                Folder = folderName
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);
            return uploadResult.SecureUrl.ToString();
        }
        else
        {
            var uploadParams = new RawUploadParams()
            {
                File = new FileDescription(fileName, fileStream),
                Folder = folderName
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);
            return uploadResult.SecureUrl.ToString();
        }
    }
}
