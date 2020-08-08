using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Validators;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _dataContext;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(DataContext dataContext, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _dataContext = dataContext;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _dataContext.Users.AnyAsync(x => x.Email == request.Email,
                    cancellationToken: cancellationToken))
                {
                    throw new RestException(HttpStatusCode.BadRequest, new {Email = "Email already exist"});
                }

                if (await _dataContext.Users.AnyAsync(x => x.UserName == request.Username,
                    cancellationToken: cancellationToken))
                {
                    throw new RestException(HttpStatusCode.BadRequest, new {UserName = "UserName already exist"});
                }


                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = null
                    };
                }

                throw new Exception("Problem creating user");
            }
        }
    }
}