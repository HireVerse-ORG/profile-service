import { inject, injectable } from "inversify";
import { BaseController } from "../../../core/base.controller";
import TYPES from "../../../core/container/container.types";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { Request, Response } from 'express';
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { ISeekerProfileService } from "../profile/interface/seeker.profile.service.interface";
import { ISeekerPortfolioService } from "./interface/seeker.portfolio.service.interface";

@injectable()
export class SeekerPortfolioController extends BaseController {
    @inject(TYPES.SeekerPortfolioService) private service!: ISeekerPortfolioService;
    @inject(TYPES.SeekerProfileService) private profileService!: ISeekerProfileService;

    /**
    * @route POST /api/profile/seeker/portfolio
    * @scope Seeker
    **/
    public createPortfolio = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const {thumbnail, title, mediaLink } = req.body;
        
        const profile = await this.profileService.getProfileByUserId(userId);

        if(!profile){
            return res.status(404).json({message: "You dont have profile"});
        }
        const portfolio = await this.service.createPortfolio({userId, profileId: profile.id, thumbnail, title, mediaLink})
        return res.status(201).json(portfolio)
    });

    /**
    * @route PUT /api/profile/seeker/portfolio/:id
    * @scope Seeker
    **/
    public updatePortfolio = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const {id} = req.params;
        const {thumbnail, title, mediaLink } = req.body;

        const portfolio = await this.service.updatePortfolio(id, {thumbnail, title, mediaLink});
        return res.json(portfolio)
    });

    /**
    * @route PUT /api/profile/seeker/portfolio/:id
    * @scope Seeker
    **/
    public deletePortfolio = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const {id} = req.params;
        const deleted = await this.service.deletePortfolio(id);
        return res.json({deleted});
    });

    /**
    * @route GET /api/profile/seeker/portfolio
    * @scope Seeker
    **/
    public listPortfolioForUser = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const Portfolio = await this.service.listPortfoliosByUser(userId);
        return res.json(Portfolio)
    });
    /**
    * @route GET /api/profile/seeker/portfolio/:username
    * @scope public
    **/
    public listPortfolioForUsername = asyncWrapper(async (req: Request, res: Response) => {
        const {username} = req.params;
        const profile = await this.profileService.getProfileByUserName(username);
        if(!profile){
            return res.status(404).json({message: "You dont have profile"});
        }
        const Portfolio = await this.service.listPortfoliosByPrfoile(profile.id);
        return res.json(Portfolio)
    });
}