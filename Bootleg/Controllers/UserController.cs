﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bootleg.Helpers;
using Bootleg.Models;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bootleg.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IContentService _contentService;
        private readonly IUserService _userService;
        private readonly IBlobService _blobService;
        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_blobService">Service to be injected by the container.</param>
        public UserController(IContentService _contentService, IUserService _userService, IBlobService _blobService)
        {
            // Set our instances of our services.
            this._contentService = _contentService;
            this._userService = _userService;
            this._blobService = _blobService;
        }
        [HttpGet("GetUser")]
        public async Task<DTO<User>> GetUser(string userId)
        {
            // Surround with try/catch:
            try
            {
                var user = await _userService.GetUser(userId);
                return new DTO<User>()
                {
                    Data = user.Data,
                    Success = true
                };
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<User>()
                {
                    Errors = new Dictionary<string, List<string>>()
                    {
                        ["*"] = new List<string> { ex.Message },
                    },
                    Success = false
                };
            }
        }
        [HttpGet("GetUserContent")]
        public async Task<DTO<Tuple<User, List<Content>>>> GetUserContent(string userId)
        {
            // Surround with try/catch:
            try
            {
                var user = await _userService.GetUser(userId);
                return await _contentService.GetUserContent(user.Data);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<Tuple<User, List<Content>>>()
                {
                    Errors = new Dictionary<string, List<string>>()
                    {
                        ["*"] = new List<string> { ex.Message },
                    },
                    Success = false
                };
            }
        }

        [HttpPost("UpdateUser")]
        [DisableRequestSizeLimit]
        public async Task<DTO<User>> UpdateUser()
        {
            try
            {
                var user = await _userService.GetUser(Request.Form["userId"]);
                var blob = await _blobService.UploadBlob(Request);
                var updatedUser = await _userService.UpdateUser(user.Data, blob);

                return new DTO<User>()
                {
                    Data = updatedUser.Data,
                    Success = true
                };
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<User>()
                {
                    Errors = new Dictionary<string, List<string>>()
                    {
                        ["*"] = new List<string> { ex.Message },
                    },
                    Success = false
                };
            }
        }
    }
}